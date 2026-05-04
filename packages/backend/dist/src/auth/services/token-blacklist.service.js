"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
let TokenBlacklistService = class TokenBlacklistService {
    blacklist = new Set();
    add(token) {
        this.blacklist.add(token);
    }
    isBlacklisted(token) {
        return this.blacklist.has(token);
    }
    removeExpiredTokens(expiresIn) {
        const now = Date.now();
        this.blacklist.forEach((token) => {
            const [, payload] = token.split('.');
            if (payload) {
                try {
                    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
                    if (decoded.exp * 1000 < now) {
                        this.blacklist.delete(token);
                    }
                }
                catch {
                    this.blacklist.delete(token);
                }
            }
        });
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)()
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map