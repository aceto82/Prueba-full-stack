'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPrescriptions } from '@/lib/api';

interface Prescription {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  notes?: string;
  createdAt: string;
  consumedAt?: string;
  patient: { id: string; user: { name: string } };
  author: { id: string; user: { name: string } };
  items: { id: string; name: string }[];
}

interface PrescriptionsResponse {
  data: Prescription[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function DoctorPrescriptionsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchPrescriptions = async () => {
    try {
      const response = await getPrescriptions({
        mine: true,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
      }) as PrescriptionsResponse;
      setPrescriptions(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [status, from, to]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Dr. {user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Mis Prescripciones</h2>
          <Link
            href="/doctor/prescriptions/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Nueva Prescripción
          </Link>
        </div>

        <div className="mb-4 flex gap-4 flex-wrap">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
            style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="consumed">Consumidas</option>
          </select>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-3 py-2"
            style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            placeholder="Desde"
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-3 py-2"
            style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            placeholder="Hasta"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        {prescriptions.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
            No hay prescripciones
          </div>
        ) : (
          <div className="bg-card shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--color-border)' }}>
              <thead style={{ backgroundColor: 'var(--color-bg-alt)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text-muted)' }}>Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text-muted)' }}>Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text-muted)' }}>Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text-muted)' }}>Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {prescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--color-text)' }}>
                      <Link href={`/doctor/prescriptions/${rx.id}`} className="text-link hover:underline">
                        {rx.code}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--color-text)' }}>
                      {rx.patient.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${rx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {rx.status === 'pending' ? 'Pendiente' : 'Consumida'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(rx.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}