import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos';
import { AuthInterface } from './interfaces/auth.interface';
import { Tokens } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUpLocal(signUpDto: SignUpDto): Promise<Tokens> {
    // get req.body
    const body = signUpDto;

    // hashing password
    const hashPassword = await argon2.hash(body.password);

    // creating the user
    const newUser = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashPassword,
      },
    });

    // return access and refresh token
    const genTokens = await this.getTokens(newUser.id, newUser.email);

    // update the new created user refreshToken
    await this.updateUserRtHash(newUser.id, genTokens.refresh_token);
    return genTokens;
  }
  signInLocal(): void {}
  logout(): void {}
  newRefreshTokens(): void {}

  async updateUserRtHash(userId: number, refreshToken: string): Promise<void> {
    const hashRt = await argon2.hash(refreshToken);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt,
      },
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
