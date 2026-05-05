import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AuthGuard } from '../components/AuthGuard';
import type { UserRole } from '../lib/auth';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
  roleHome: jest.requireActual('../context/AuthContext').roleHome,
}));

import { useAuth } from '../context/AuthContext';

interface StubUser {
  sub: string;
  email: string;
  role: UserRole;
}

function stubAuth(user: StubUser | null, isLoading: boolean) {
  (useAuth as jest.Mock).mockReturnValue({ user, isLoading, login: jest.fn(), logout: jest.fn() });
}

describe('AuthGuard', () => {
  let mockReplace: jest.Mock;

  beforeEach(() => {
    mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, push: jest.fn(), back: jest.fn() });
  });

  it('shows a spinner while auth is loading', () => {
    stubAuth(null, true);
    render(<AuthGuard role="doctor"><div>protected</div></AuthGuard>);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is null and not loading', () => {
    stubAuth(null, false);
    render(<AuthGuard role="doctor"><div>protected</div></AuthGuard>);
    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  it('redirects to role home when user has a different role', () => {
    stubAuth({ sub: '1', email: 'p@test.com', role: 'patient' }, false);
    render(<AuthGuard role="doctor"><div>protected</div></AuthGuard>);
    expect(mockReplace).toHaveBeenCalledWith('/patient/prescriptions');
    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  it('renders children when user role matches required role', () => {
    stubAuth({ sub: '1', email: 'dr@test.com', role: 'doctor' }, false);
    render(<AuthGuard role="doctor"><div>protected</div></AuthGuard>);
    expect(screen.getByText('protected')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
