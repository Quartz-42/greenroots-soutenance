import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authService.login(
      signInDto.email,
      signInDto.password,
    );
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.send(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.register(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
    });
    console.log('Déconnexion réussie');
    return { message: 'Déconnexion réussie' };
  }
}
