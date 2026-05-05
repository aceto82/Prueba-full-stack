'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { AuthGuard } from '../../../../components/AuthGuard';
import { Navbar } from '../../../../components/Navbar';
import { Skeleton, SkeletonList } from '../../../../components/Skeleton';
import { useToast } from '../../../../context/ToastContext';
import { ApiError, apiFetch, apiFetchBlob } from '../../../../lib/api';

interface PrescriptionDetail {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  notes: string | null;
  createdAt: string;
  consumedAt: string | null;
  patient: { user: { name: string; email: string } };
  author: { user: { name: string }; specialty: string | null };
  items: Array<{
    id: string;
    name: string;
    dosage: string | null;
    quantity: number | null;
    instructions: string | null;
  }>;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  consumed: 'bg-green-100 text-green-800',
};
const statusLabels = { pending: 'Pendiente', consumed: 'Consumida' };

export default function PatientPrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { showToast } = useToast();
  const [prescription, setPrescription] = useState<PrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [consuming, setConsuming] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    apiFetch<PrescriptionDetail>(`/prescriptions/${id}`)
      .then(setPrescription)
      .catch(() => setError('Error al cargar la prescripción'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleConsume() {
    if (!prescription) return;
    setConsuming(true);
    try {
      await apiFetch(`/prescriptions/${id}/consume`, { method: 'PUT' });
      setPrescription((prev) => (prev ? { ...prev, status: 'consumed' } : prev));
      showToast('Prescripción marcada como consumida', 'success');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al consumir prescripción';
      showToast(msg, 'error');
    } finally {
      setConsuming(false);
    }
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      const blob = await apiFetchBlob(`/prescriptions/${id}/pdf`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescripcion-${prescription?.code ?? id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast('Error al descargar el PDF', 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <AuthGuard role="patient">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          <Link
            href="/patient/prescriptions"
            className="text-sm text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Volver
          </Link>

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-7 w-1/3" />
              <SkeletonList rows={3} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {prescription && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{prescription.code}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(prescription.createdAt).toLocaleDateString('es-ES', {
                      dateStyle: 'long',
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[prescription.status]}`}
                >
                  {statusLabels[prescription.status]}
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Médico</h2>
                <Row label="Doctor" value={prescription.author.user.name} />
                {prescription.author.specialty && (
                  <Row label="Especialidad" value={prescription.author.specialty} />
                )}
              </div>

              {prescription.notes && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">Notas</h2>
                  <p className="text-sm text-gray-600">{prescription.notes}</p>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Medicamentos</h2>
                <div className="space-y-3">
                  {prescription.items.map((item) => (
                    <div key={item.id} className="border-l-2 border-green-200 pl-3">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.dosage && (
                        <p className="text-xs text-gray-500">Dosis: {item.dosage}</p>
                      )}
                      {item.quantity != null && (
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      )}
                      {item.instructions && (
                        <p className="text-xs text-gray-500">Instrucciones: {item.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {prescription.status === 'pending' && (
                  <button
                    onClick={handleConsume}
                    disabled={consuming}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    {consuming ? 'Procesando...' : 'Marcar como consumida'}
                  </button>
                )}
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                  {downloading ? 'Descargando...' : 'Descargar PDF'}
                </button>
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
      <span className="text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
