import { describe, it, expect } from 'vitest';

describe('Basic Tests', () => {
  it('should pass basic assertion', () => {
    expect(true).toBe(true);
  });

  it('should have working expect', () => {
    expect(1 + 1).toBe(2);
  });
});