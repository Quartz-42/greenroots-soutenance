import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    console.log(email, password);
    const user = await this.userService.findOneByEmail(email);
    console.log('user', user);

    //récupère le password en bdd déjà hashé et tu les compare avec le mode pa

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);

      if (!isMatch) {
        console.log('password incorrect'); //* A implémenter
        return;
      }

      console.log('Login réussit');
      const payload = { sub: user.id, user };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      console.log("pas d'user enrigstré");
      return 400;
    }
  }

  async register(email: string, name: string, password: string): Promise<any> {
    const isExist = await this.userService.findOneByEmail(email);
    if (isExist) {
      console.log('user déja enregistré en BDD'); //* A implémenter
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      email,
      password: passwordHash,
      name,
    });

    const payload = { sub: user.id, user };
    const token = await this.jwtService.signAsync(payload);
    return { user, token };
  }
}
