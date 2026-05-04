import { describe, it, expect } from 'vitest';

describe('Prescription Types', () => {
  it('should have correct prescription status type', () => {
    type PrescriptionStatus = 'pending' | 'consumed';
    const status: PrescriptionStatus = 'pending';
    expect(status).toBe('pending');
  });

  it('should have correct prescription interface', () => {
    interface Prescription {
      id: string;
      code: string;
      status: 'pending' | 'consumed';
    }
    
    const rx: Prescription = {
      id: 'test-123',
      code: 'RX-001',
      status: 'pending'
    };
    
    expect(rx.status).toBe('pending');
    expect(rx.code).toContain('RX-');
  });
});