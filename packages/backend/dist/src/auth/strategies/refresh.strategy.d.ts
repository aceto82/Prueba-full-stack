import { Strategy } from 'passport-jwt';
interface JwtPayload {
    sub: string;
    role: string;
}
declare const RefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshStrategy extends RefreshStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        userId: string;
        role: string;
    }>;
}
export {};
