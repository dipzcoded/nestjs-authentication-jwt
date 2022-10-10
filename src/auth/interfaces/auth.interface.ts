import { SignUpDto } from '../dtos';
import { Tokens } from '../types';

export interface AuthInterface {
  signUpLocal(dto: SignUpDto): Promise<Tokens>;
  signInLocal(): void;
  logout(): void;
  newRefreshTokens(): void;
  getTokens(userId: number, userEmail: string): Promise<Tokens>;
  updateUserRtHash(userId: number, refreshToken: string): Promise<void>;
}
