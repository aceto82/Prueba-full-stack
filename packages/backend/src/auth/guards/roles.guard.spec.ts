import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

function makeContext(role: string, requiredRoles: string[] | undefined): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user: { role } }),
    }),
  } as any;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('passes when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(makeContext('patient', undefined))).toBe(true);
  });

  it('passes when user role matches required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['doctor']);
    expect(guard.canActivate(makeContext('doctor', ['doctor']))).toBe(true);
  });

  it('throws ForbiddenException when role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['doctor']);
    expect(() => guard.canActivate(makeContext('patient', ['doctor']))).toThrow(ForbiddenException);
  });

  it('admin bypasses all role restrictions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['doctor']);
    expect(guard.canActivate(makeContext('admin', ['doctor']))).toBe(true);
  });
});
