export interface AuthInterface {
  signUpLocal(): void;
  signInLocal(): void;
  logout(): void;
  newRefreshTokens(): void;
}
