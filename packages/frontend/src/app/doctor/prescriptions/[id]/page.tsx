'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { AuthGuard } from '../../../../components/AuthGuard';
import { Navbar } from '../../../../components/Navbar';
import { Skeleton, SkeletonList } from '../../../../components/Skeleton';
import { apiFetch } from '../../../../lib/api';

interface PrescriptionDetail {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  notes: string | null;
  createdAt: string;
  consumedAt: string | null;
  patient: { user: { name: string; email: string } };
  author: { user: { name: string }; specialty: string | null };
  items: Array<{ id: string; name: string; dosage: string | null; quantity: number | null; instructions: string | null }>;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  consumed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};
const statusLabels = { pending: 'Pendiente', consumed: 'Consumida' };

export default function DoctorPrescriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [prescription, setPrescription] = useState<PrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<PrescriptionDetail>(`/prescriptions/${id}`)
      .then(setPrescription)
      .catch(() => setError('Error al cargar la prescripción'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AuthGuard role="doctor">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          <Link href="/doctor/prescriptions" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Volver
          </Link>

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-7 w-1/3" />
              <SkeletonList rows={3} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">{error}</div>
          )}

          {prescription && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{prescription.code}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(prescription.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[prescription.status]}`}>
                  {statusLabels[prescription.status]}
                </span>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Información</h2>
                <Row label="Paciente" value={prescription.patient.user.name} />
                <Row label="Email" value={prescription.patient.user.email} />
                {prescription.notes && <Row label="Notas" value={prescription.notes} />}
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Medicamentos</h2>
                <div className="space-y-3">
                  {prescription.items.map((item) => (
                    <div key={item.id} className="border-l-2 border-blue-200 dark:border-blue-700 pl-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                      {item.dosage && <p className="text-xs text-gray-500 dark:text-gray-400">Dosis: {item.dosage}</p>}
                      {item.quantity != null && <p className="text-xs text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>}
                      {item.instructions && <p className="text-xs text-gray-500 dark:text-gray-400">Instrucciones: {item.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 dark:text-gray-400 w-24 shrink-0">{label}</span>
      <span className="text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}
