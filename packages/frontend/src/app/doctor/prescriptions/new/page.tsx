'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthGuard } from '../../../../components/AuthGuard';
import { Navbar } from '../../../../components/Navbar';
import { ApiError, apiFetch } from '../../../../lib/api';
import { useToast } from '../../../../context/ToastContext';

interface Patient {
  id: string;
  user: { name: string; email: string };
}

interface Item {
  name: string;
  dosage: string;
  quantity: string;
  instructions: string;
}

const emptyItem = (): Item => ({ name: '', dosage: '', quantity: '', instructions: '' });

export default function NewPrescriptionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Item[]>([emptyItem()]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<{ data: Patient[] }>('/patients?limit=100').then((res) => setPatients(res.data));
  }, []);

  function updateItem(idx: number, field: keyof Item, value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Agrega al menos un medicamento', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        patientId,
        notes: notes || undefined,
        items: items.map((it) => ({
          name: it.name,
          dosage: it.dosage || undefined,
          quantity: it.quantity ? parseInt(it.quantity) : undefined,
          instructions: it.instructions || undefined,
        })),
      };
      const res = await apiFetch<{ id: string }>('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      showToast('Prescripción creada', 'success');
      router.push(`/doctor/prescriptions/${res.id}`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al crear prescripción';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGuard role="doctor">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Nueva Prescripción</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un paciente</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user.name} ({p.user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Indicaciones adicionales..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Medicamentos</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Agregar
                </button>
              </div>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex gap-2">
                      <input
                        required
                        placeholder="Nombre del medicamento"
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:text-red-700 text-sm px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Dosis"
                        value={item.dosage}
                        onChange={(e) => updateItem(idx, 'dosage', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        placeholder="Cantidad"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      placeholder="Instrucciones"
                      value={item.instructions}
                      onChange={(e) => updateItem(idx, 'instructions', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                {submitting ? 'Guardando...' : 'Crear Prescripción'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
