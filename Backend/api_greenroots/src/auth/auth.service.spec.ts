import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

// Créer un mock pour UserService
const mockUserService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

// Mock complet du module users.service
jest.mock('../users/users.service', () => ({
  UserService: jest.fn().mockImplementation(() => mockUserService),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: 'UserService',
          useValue: mockUserService,
        },
      ],
    })
      .overrideProvider(AuthService)
      .useFactory({
        factory: () => {
          return new AuthService(mockJwtService as any, mockUserService as any);
        },
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException when email is missing', async () => {
      await expect(service.login('', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is missing', async () => {
      await expect(service.login('email@test.com', '')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);
      await expect(service.login('email@test.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'email@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        UserRole: [],
      };

      mockUserService.findOneByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        service.login('email@test.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token and user data when login is successful (no roles)', async () => {
      const mockUser = {
        id: 1,
        email: 'email@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        UserRole: [],
      };

      mockUserService.findOneByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.login('email@test.com', 'password');

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'email@test.com',
        },
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        role: 'User',
        email: 'email@test.com',
      });
    });

    it('should return access token with Admin role when user has Admin role', async () => {
      const mockUser = {
        id: 1,
        email: 'admin@test.com',
        password: 'hashedPassword',
        name: 'Admin User',
        UserRole: [{ Role: { name: 'Admin' } }],
      };

      mockUserService.findOneByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const loginResult = await service.login('admin@test.com', 'password');

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        role: 'Admin',
        email: 'admin@test.com',
      });

      expect(loginResult).toBeDefined();
    });
  });

  describe('register', () => {
    it('should throw ConflictException when user already exists', async () => {
      mockUserService.findOneByEmail.mockResolvedValueOnce({
        id: 1,
        email: 'existing@test.com',
      });

      await expect(
        service.register('existing@test.com', 'password', 'Existing User'),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return access token when registration is successful', async () => {
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const mockCreatedUser = {
        id: 1,
        email: 'new@test.com',
        name: 'New User',
        password: 'hashedPassword',
      };

      mockUserService.create.mockResolvedValueOnce(mockCreatedUser);

      const result = await service.register(
        'new@test.com',
        'password',
        'New User',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(mockUserService.create).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'hashedPassword',
        name: 'New User',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        role: 'User',
        email: 'new@test.com',
      });

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 1,
          name: 'New User',
          email: 'new@test.com',
          role: 'User',
        },
      });
    });
  });
});
