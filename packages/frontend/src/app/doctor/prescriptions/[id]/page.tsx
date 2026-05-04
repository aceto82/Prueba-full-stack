'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getPrescription, Prescription } from '@/lib/api';

export default function DoctorPrescriptionDetailPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params.id as string;
    getPrescription(id)
      .then(setPrescription)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error cargando');
      })
      .finally(() => setLoading(false));
  }, [params.id]);

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

  if (error || !prescription) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error || 'Prescripción no encontrada'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary">
            Dr. {user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-secondary hover:text-primary"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/doctor/prescriptions"
            className="text-link hover:underline"
          >
            ← Volver
          </Link>
        </div>

        <div className="bg-card shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{prescription.code}</h2>
              <p className="text-muted">
                {new Date(prescription.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded ${
                prescription.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {prescription.status === 'pending' ? 'Pendiente' : 'Consumida'}
            </span>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Paciente</h3>
            <p className="text-primary">{prescription.patient.user.name}</p>
          </div>

          {prescription.notes && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Notas</h3>
              <p className="text-primary">{prescription.notes}</p>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Ítems</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: 'var(--color-bg-alt)' }}>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">
                    Medicamento
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">
                    Dosis
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">
                    Cantidad
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">
                    Indicaciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prescription.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2 text-muted">{item.dosage || '-'}</td>
                    <td className="px-3 py-2 text-muted">
                      {item.quantity || '-'}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {item.instructions || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}