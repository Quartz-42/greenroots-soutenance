import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';

// Mock des dépendances
jest.mock('./auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    register: jest.fn(),
  })),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };

  const mockRequest = {
    csrfToken: jest.fn().mockReturnValue('test-csrf-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCsrfToken', () => {
    it('should return a CSRF token', () => {
      const result = controller.getCsrfToken(mockRequest as any);
      expect(result).toEqual({ token: 'test-csrf-token' });
      expect(mockRequest.csrfToken).toHaveBeenCalled();
    });

    it('should throw an exception if CSRF token generation fails', () => {
      mockRequest.csrfToken.mockImplementationOnce(() => {
        throw new Error('CSRF token generation failed');
      });

      expect(() => controller.getCsrfToken(mockRequest as any)).toThrow(
        HttpException,
      );
    });
  });

  describe('signIn', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should return user data and set cookie on successful login', async () => {
      mockAuthService.login.mockResolvedValueOnce({
        access_token: 'test-access-token',
        user: mockUser,
      });

      await controller.signIn(loginDto, mockResponse as any);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'test-access-token',
        {
          httpOnly: true,
          sameSite: 'lax',
        },
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an exception when login fails', async () => {
      mockAuthService.login.mockRejectedValueOnce(
        new HttpException('Login failed', HttpStatus.BAD_REQUEST),
      );

      await expect(
        controller.signIn(loginDto, mockResponse as any),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('signUp', () => {
    const registerDto: RegisterDto = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    };

    const mockRegisteredUser = {
      id: 1,
      email: 'new@example.com',
      name: 'New User',
      role: 'User',
    };

    it('should return user data on successful registration', async () => {
      mockAuthService.register.mockResolvedValueOnce({
        access_token: 'test-access-token',
        user: mockRegisteredUser,
      });

      const result = await controller.signUp(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      expect(result).toEqual({
        access_token: 'test-access-token',
        user: mockRegisteredUser,
      });
    });

    it('should throw an exception when registration fails', async () => {
      mockAuthService.register.mockRejectedValueOnce(
        new HttpException('Registration failed', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.signUp(registerDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('logout', () => {
    it('should clear cookie and return success message', () => {
      const result = controller.logout(mockResponse as any, mockRequest as any);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token', {
        httpOnly: true,
        sameSite: 'lax',
      });
      expect(result).toEqual({ message: 'Déconnexion réussie' });
    });

    it('should throw an exception when logout fails', () => {
      mockResponse.clearCookie.mockImplementationOnce(() => {
        throw new Error('Logout failed');
      });

      expect(() =>
        controller.logout(mockResponse as any, mockRequest as any),
      ).toThrow(HttpException);
    });
  });
});
