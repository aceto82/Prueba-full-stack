import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklist = new Set<string>();

  add(token: string) {
    this.blacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  removeExpiredTokens(expiresIn: number) {
    const now = Date.now();
    this.blacklist.forEach((token) => {
      const [, payload] = token.split('.');
      if (payload) {
        try {
          const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
          if (decoded.exp * 1000 < now) {
            this.blacklist.delete(token);
          }
        } catch {
          this.blacklist.delete(token);
        }
      }
    });
  }
}