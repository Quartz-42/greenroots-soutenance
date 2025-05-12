import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new UnauthorizedException('Email ou mot de passe manquant');
    }
    try {
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }

      let userRole: string;

      if (user.UserRole.length === 0) {
        // Si l'utilisateur n'a aucun rôle, on attribue le rôle par défaut "User"
        userRole = 'User';
      } else {
        // On vérifie si l'utilisateur a le rôle "Admin"
        const roleArray = user.UserRole.map((userRole) => userRole.Role?.name);
        userRole = roleArray.includes('Admin') ? 'Admin' : 'User';
      }

      const payload = {
        sub: user.id,
        role: userRole,
        email: user.email,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async register(email: string, password: string, name: string): Promise<any> {
    const isExist = await this.userService.findOneByEmail(email);
    if (isExist) {
      throw new ConflictException('Cet utilisateur est déjà enregistré');
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.userService.create({
        email,
        password: passwordHash,
        name,
      });

      const payload = {
        sub: user.id,
        role: 'User',
        email: user.email,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'User',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
