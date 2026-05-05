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
  patient: { user: { name: string } };
}

interface PaginatedResponse {
  data: Prescription[];
  total: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  consumed: 'bg-green-100 text-green-800',
};

const statusLabels = { pending: 'Pendiente', consumed: 'Consumida' };

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ limit: '50' });
    if (statusFilter) params.set('status', statusFilter);

    setLoading(true);
    apiFetch<PaginatedResponse>(`/prescriptions?${params}`)
      .then((res) => setPrescriptions(res.data))
      .catch(() => setError('Error al cargar prescripciones'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <AuthGuard role="doctor">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Mis Prescripciones</h1>
            <Link
              href="/doctor/prescriptions/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nueva
            </Link>
          </div>

          <div className="flex gap-2 mb-4">
            {['', 'pending', 'consumed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {s === '' ? 'Todas' : statusLabels[s as 'pending' | 'consumed']}
              </button>
            ))}
          </div>

          {loading && <SkeletonList />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && prescriptions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-3">No tienes prescripciones aún.</p>
              <Link href="/doctor/prescriptions/new" className="text-blue-600 hover:underline text-sm">
                Crear tu primera prescripción
              </Link>
            </div>
          )}

          {!loading && !error && prescriptions.length > 0 && (
            <div className="space-y-2">
              {prescriptions.map((p) => (
                <Link
                  key={p.id}
                  href={`/doctor/prescriptions/${p.id}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.code}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.patient.user.name}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <p className="text-xs text-gray-400">
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
