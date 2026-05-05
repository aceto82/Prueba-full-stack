'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthGuard } from '../../../components/AuthGuard';
import { Navbar } from '../../../components/Navbar';
import { SkeletonList } from '../../../components/Skeleton';
import { apiFetch } from '../../../lib/api';

interface Prescription {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  createdAt: string;
  author: { user: { name: string } };
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  consumed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const statusLabels = { pending: 'Pendiente', consumed: 'Consumida' };

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Prescription[]>('/me/prescriptions')
      .then(setPrescriptions)
      .catch(() => setError('Error al cargar prescripciones'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard role="patient">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Mis Prescripciones</h1>

          {loading && <SkeletonList />}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && prescriptions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">No tienes prescripciones disponibles.</p>
            </div>
          )}

          {!loading && !error && prescriptions.length > 0 && (
            <div className="space-y-2">
              {prescriptions.map((p) => (
                <Link
                  key={p.id}
                  href={`/patient/prescriptions/${p.id}`}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{p.code}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Dr. {p.author.user.name}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString('es-ES')}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[p.status]}`}
                    >
                      {statusLabels[p.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
