import { SignInDto, SignUpDto } from '../dtos';
import { Tokens } from '../types';

export interface AuthInterface {
  signUpAsUser(dto: SignUpDto): Promise<Tokens>;
  signUpAsSuperAdmin(dto: SignUpDto): Promise<Tokens>;
  signInLocal(dto: SignInDto): Promise<Tokens>;
  logout(userId: number): Promise<void>;
  newRefreshTokens(userId: number, refreshToken: string): Promise<Tokens>;
  getTokens(userId: number, userEmail: string): Promise<Tokens>;
  updateUserRtHash(userId: number, refreshToken: string): Promise<void>;
}
