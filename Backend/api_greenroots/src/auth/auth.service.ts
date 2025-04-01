import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
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
    const user = await this.userService.findOneByEmail(email);

    //récupère le password en bdd déjà hashé et tu les compare avec le mode pa

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password incorrect'); //* A implémenter
        return;
      }

      console.log('Login réussi');
      const payload = { sub: user.id, user };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      console.log("Pas d'user enregistré");
      return 400;
    }
  }

  async register(email: string, password: string, name: string): Promise<any> {
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

  async checkToken(@Req() req): Promise<any> {
    // Récupération de l'en-tête d'autorisation
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Aucun header trouvé');
    }

    // Vérification que l'en-tête commence par "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException("Format d'en-tête non valide");
    }

    // Extraction du token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    // Vérification du token dans un bloc try/catch pour gérer les erreurs
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
