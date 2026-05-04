import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../src/app/login/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  it('renders submit button', () => {
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('renders email input field', () => {
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});