import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUpLocal() {
    return this.authService.signUpLocal();
  }

  @Post('/login')
  signInLocal() {
    return this.authService.signInLocal();
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refreshtokens')
  newRefreshToken() {
    return this.authService.newRefreshTokens();
  }
}
