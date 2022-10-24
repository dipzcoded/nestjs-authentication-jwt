import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dtos';
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

    // check if user exists
    const userFound = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (userFound) {
      throw new BadRequestException(
        'user already exist with the provided email sent',
      );
    }

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

  async signUpAsSuperAdmin(dto: SignUpDto): Promise<Tokens> {
    const body = dto;

    // getting users that are super admins
    const isThereSuperAdmin = await this.prismaService.user.findMany({
      where: {
        isSuperAdmin: true,
      },
    });

    // checking if there is more than one super admins in the database
    if (isThereSuperAdmin.length) {
      throw new Error('there can only be one super admin');
    }

    // find user by email
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      throw new ForbiddenException('user already exists');
    }

    // hash user password
    const hashPassword = await argon2.hash(body.password);

    const newUser = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        isSuperAdmin: true,
      },
    });

    // generate tokens
    const genTokens = await this.getTokens(newUser.id, newUser.email);

    // update user refresh token
    await this.updateUserRtHash(newUser.id, genTokens.refresh_token);
    return genTokens;
  }

  async signInLocal(sigInDto: SignInDto): Promise<Tokens> {
    const body = sigInDto;

    // find user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid Credentails');
    }

    if (!(await argon2.verify(user.password, body.password))) {
      throw new ForbiddenException('Invalid Credentails');
    }

    // return access and refresh token
    const genTokens = await this.getTokens(user.id, user.email);

    // update the new created user refreshToken
    await this.updateUserRtHash(user.id, genTokens.refresh_token);
    return genTokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
  }
  async newRefreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashRt) {
      throw new ForbiddenException('Access Denied');
    }

    if (!(await argon2.verify(user.hashRt, refreshToken))) {
      throw new ForbiddenException('Access Denied!');
    }

    // return access and refresh token
    const genTokens = await this.getTokens(user.id, user.email);

    // update the new created user refreshToken
    await this.updateUserRtHash(user.id, genTokens.refresh_token);
    return genTokens;
  }

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
