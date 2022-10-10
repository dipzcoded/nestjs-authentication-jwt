import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUpLocal(@Body() signUpDto: SignUpDto) {
    return this.authService.signUpLocal(signUpDto);
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
