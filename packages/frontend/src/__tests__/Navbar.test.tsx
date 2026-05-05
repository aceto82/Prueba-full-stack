import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Navbar } from '../components/Navbar';
import type { UserRole } from '../lib/auth';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../context/ToastContext', () => ({
  useToast: jest.fn(() => ({ showToast: jest.fn() })),
}));

import { useAuth } from '../context/AuthContext';

interface StubUser {
  sub: string;
  email: string;
  role: UserRole;
}

function renderNavbar(user: StubUser | null, logout = jest.fn()) {
  (useAuth as jest.Mock).mockReturnValue({ user, isLoading: false, login: jest.fn(), logout });
  (useRouter as jest.Mock).mockReturnValue({ replace: jest.fn(), push: jest.fn(), back: jest.fn() });
  return render(<Navbar />);
}

describe('Navbar', () => {
  it('renders user email and role badge when authenticated', () => {
    renderNavbar({ sub: '1', email: 'dr@test.com', role: 'doctor' });
    expect(screen.getByText('dr@test.com')).toBeInTheDocument();
    expect(screen.getByText('doctor')).toBeInTheDocument();
  });

  it('does not render email or role when user is null', () => {
    renderNavbar(null);
    expect(screen.queryByText('dr@test.com')).not.toBeInTheDocument();
    expect(screen.queryByText('doctor')).not.toBeInTheDocument();
  });

  it('calls logout when the Salir button is clicked', async () => {
    const logoutMock = jest.fn().mockResolvedValue(undefined);
    renderNavbar({ sub: '1', email: 'dr@test.com', role: 'doctor' }, logoutMock);
    await userEvent.click(screen.getByRole('button', { name: /salir/i }));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
