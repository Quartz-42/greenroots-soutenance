import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request) {
    try {
      return { token: req.csrfToken() };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { access_token, user } = await this.authService.login(
        signInDto.email,
        signInDto.password,
      );
      res.cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'lax',
      });
      res.send(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signUpDto: RegisterDto,
  ) {
    try {
      return this.authService.register(
        signUpDto.email,
        signUpDto.password,
        signUpDto.name,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'lax',
      });
      console.log('Déconnexion réussie');
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
