'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      router.push('/doctor/prescriptions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-card p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--color-text)' }}>
          App de Prescripciones
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded text-sm" style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text)' }}>
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <p>Cuentas de prueba:</p>
          <p className="mt-1">admin@test.com / password123</p>
          <p>dr@test.com / password123</p>
          <p>patient@test.com / password123</p>
        </div>
      </div>
    </div>
  );
}