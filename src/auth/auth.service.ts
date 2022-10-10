import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthInterface } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(private prismaService: PrismaService) {}

  signUpLocal(): void {}
  signInLocal(): void {}
  logout(): void {}
  newRefreshTokens(): void {}
}
