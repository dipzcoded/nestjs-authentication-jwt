import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorators';
import { SignInDto, SignUpDto } from './dtos';
import { RefreshJwtAuthGuard } from './guards';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signUpAsUser(@Body() signUpDto: SignUpDto) {
    return this.authService.signUpAsUser(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup/superadmin')
  signUpAsSuperAdmin(@Body() dto: SignUpDto) {
    return this.authService.signUpAsSuperAdmin(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signInLocal(@Body() signInDto: SignInDto) {
    return this.authService.signInLocal(signInDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUser('sub') userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refreshtokens')
  @HttpCode(HttpStatus.OK)
  newRefreshToken(
    @GetUser('sub') userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.newRefreshTokens(userId, refreshToken);
  }
}
