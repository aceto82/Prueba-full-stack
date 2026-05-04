'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getPatients, createPrescription } from '@/lib/api';

interface Patient {
  id: string;
  name: string;
  birthDate?: string;
}

interface PatientsResponse {
  data: Patient[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface PatientsResponse {
  data: Patient[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface ItemForm {
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
}

export default function NewPrescriptionPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [patientId, setPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemForm[]>([
    { name: '', dosage: '', quantity: 1, instructions: '' },
  ]);

  useEffect(() => {
    getPatients()
      .then((response: PatientsResponse) => setPatients(response.data || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  }, []);

  const addItem = () => {
    setItems([...items, { name: '', dosage: '', quantity: 1, instructions: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ItemForm, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createPrescription({
        patientId,
        notes: notes || undefined,
        items: items
          .filter((item) => item.name.trim())
          .map((item) => ({
            name: item.name,
            dosage: item.dosage || undefined,
            quantity: item.quantity || undefined,
            instructions: item.instructions || undefined,
          })),
      });
      setSuccess(true);
      setTimeout(() => router.push('/doctor/prescriptions'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando prescripción');
    } finally {
      setSubmitting(false);
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
          <h2 className="text-2xl font-bold mb-6">Nueva Prescripción</h2>

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
              Prescripción creada exitosamente
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Paciente *
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Seleccionar paciente</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-primary">
                  Ítems *
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-link hover:underline"
                >
                  + Agregar ítem
                </button>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded p-4 mb-3"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">Ítem {index + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateItem(index, 'name', e.target.value)
                        }
                        placeholder="Medicamento *"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <input
                        value={item.dosage}
                        onChange={(e) =>
                          updateItem(index, 'dosage', e.target.value)
                        }
                        placeholder="Dosis (ej: 1 comp cada 8h)"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        placeholder="Cantidad"
                        min={1}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        value={item.instructions}
                        onChange={(e) =>
                          updateItem(index, 'instructions', e.target.value)
                        }
                        placeholder="Indicaciones"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Crear Prescripción'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}