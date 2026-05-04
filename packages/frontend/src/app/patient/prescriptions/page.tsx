'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      await fetchPrescriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setActionId(null);
    }
  };

  const handleDownload = async (id: string) => {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Mis Prescripciones</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        {prescriptions.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No hay prescripciones
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white shadow rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <Link
                    href={`/patient/prescriptions/${rx.id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {rx.code}
                  </Link>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      rx.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {rx.status === 'pending' ? 'Pendiente' : 'Consumida'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  Dr. {rx.author.user.name}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(rx.createdAt).toLocaleDateString('es-ES')}
                </p>

                <div className="flex gap-2">
                  {rx.status === 'pending' && (
                    <button
                      onClick={() => handleConsume(rx.id)}
                      disabled={actionId === rx.id}
                      className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionId === rx.id ? '...' : 'Consumir'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(rx.id)}
                    className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-sm hover:bg-gray-700"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}