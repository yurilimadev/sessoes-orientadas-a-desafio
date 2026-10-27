export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function issueAccessToken(userId: string): string {
  return `access:${userId}`;
}

export function issueRefreshToken(userId: string): string {
  return `refresh:${userId}`;
}
