'use client';

import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`text-lg leading-none hover:opacity-70 transition-opacity ${className}`}
    >
      {theme === 'dark' ? '☀' : '🌙'}
    </button>
  );
}
