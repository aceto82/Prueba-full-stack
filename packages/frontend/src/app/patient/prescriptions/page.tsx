'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPrescriptions, consumePrescription, downloadPDF } from '@/lib/api';

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

export default function PatientPrescriptionsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    try {
      const response = await getPrescriptions({}) as PrescriptionsResponse;
      setPrescriptions(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleConsume = async (id: string) => {
    setActionId(id);
    try {
      await consumePrescription(id);
      fetchPrescriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error consumiendo');
    } finally {
      setActionId(null);
    }
  };

  const handleDownload = async (id: string, code: string) => {
    try {
      await downloadPDF(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error descargando PDF');
    }
  };

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
            {user?.name}
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
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Mis Prescripciones</h2>

        {error && (
          <div className="p-3 rounded mb-4" style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text)' }}>{error}</div>
        )}

        {prescriptions.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
            No hay prescripciones
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-card shadow rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/patient/prescriptions/${rx.id}`} className="text-lg font-semibold text-link hover:underline">
                    {rx.code}
                  </Link>
                  <span className={`px-2 py-1 rounded text-xs ${rx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {rx.status === 'pending' ? 'Pendiente' : 'Consumida'}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Dr. {rx.author.user.name}</p>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{new Date(rx.createdAt).toLocaleDateString('es-ES')}</p>
                {rx.status === 'pending' && (
                  <button
                    onClick={() => handleConsume(rx.id)}
                    disabled={actionId === rx.id}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 transition-colors mb-2"
                  >
                    {actionId === rx.id ? 'Marcando...' : 'Marcar como consumida'}
                  </button>
                )}
                <button
                  onClick={() => handleDownload(rx.id, rx.code)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}