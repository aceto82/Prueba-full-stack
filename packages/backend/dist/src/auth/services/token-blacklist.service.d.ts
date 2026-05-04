export declare class TokenBlacklistService {
    private blacklist;
    add(token: string): void;
    isBlacklisted(token: string): boolean;
    removeExpiredTokens(expiresIn: number): void;
}
