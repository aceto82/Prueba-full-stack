'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  doctor: 'bg-blue-100 text-blue-800',
  patient: 'bg-green-100 text-green-800',
};

export function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    showToast('Sesión cerrada', 'info');
    router.replace('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-lg font-semibold text-gray-900">
        Prescripciones
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{user.email}</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColors[user.role] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}
