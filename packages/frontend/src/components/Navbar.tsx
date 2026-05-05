'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ThemeToggle } from './ThemeToggle';

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  patient: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
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
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Prescripciones
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColors[user.role] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              {user.role}
            </span>
          </div>
        )}
        <ThemeToggle />
        {user && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Salir
          </button>
        )}
      </div>
    </nav>
  );
}
