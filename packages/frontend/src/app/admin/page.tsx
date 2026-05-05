'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { AuthGuard } from '../../components/AuthGuard';
import { Navbar } from '../../components/Navbar';
import { Skeleton } from '../../components/Skeleton';
import { useFilterParams } from '../../hooks/useFilterParams';
import { apiFetch } from '../../lib/api';

interface Metrics {
  totals: { doctors: number; patients: number; prescriptions: number };
  byStatus: { pending: number; consumed: number };
  byDay: Array<{ date: string; count: number }>;
  topDoctors: Array<{ doctorId: string; name: string; count: number }>;
}

function MetricCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{value.toLocaleString('es-ES')}</p>
      )}
    </div>
  );
}

function AdminPageContent() {
  const { filters, setFilters } = useFilterParams(['from', 'to']);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromInput, setFromInput] = useState(filters.from);
  const [toInput, setToInput] = useState(filters.to);

  const fetchMetrics = useCallback(
    (f: string, t: string) => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (f) params.set('from', f);
      if (t) params.set('to', t);
      const qs = params.toString();
      apiFetch<Metrics>(`/admin/metrics${qs ? `?${qs}` : ''}`)
        .then(setMetrics)
        .catch(() => setError('Error al cargar métricas'))
        .finally(() => setLoading(false));
    },
    [],
  );

  useEffect(() => {
    fetchMetrics(filters.from, filters.to);
  }, [fetchMetrics, filters.from, filters.to]);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFilters({ from: fromInput, to: toInput });
  }

  return (
    <AuthGuard role="admin">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Panel de Administración</h1>
          </div>

          <form onSubmit={handleFilterSubmit} className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Desde</label>
              <input
                type="date"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Hasta</label>
              <input
                type="date"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              Filtrar
            </button>
            {(fromInput || toInput) && (
              <button
                type="button"
                onClick={() => {
                  setFromInput('');
                  setToInput('');
                  setFilters({});
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Limpiar
              </button>
            )}
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => fetchMetrics(filters.from, filters.to)}
                className="text-sm text-red-600 font-medium hover:underline ml-4"
              >
                Reintentar
              </button>
            </div>
          )}

          <section>
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Totales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard label="Doctores" value={metrics?.totals.doctors ?? 0} loading={loading} />
              <MetricCard
                label="Pacientes"
                value={metrics?.totals.patients ?? 0}
                loading={loading}
              />
              <MetricCard
                label="Prescripciones"
                value={metrics?.totals.prescriptions ?? 0}
                loading={loading}
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Por Estado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                label="Pendientes"
                value={metrics?.byStatus.pending ?? 0}
                loading={loading}
              />
              <MetricCard
                label="Consumidas"
                value={metrics?.byStatus.consumed ?? 0}
                loading={loading}
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Top 10 Doctores
            </h2>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : metrics && metrics.topDoctors.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-400 font-medium">#</th>
                      <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-400 font-medium">Doctor</th>
                      <th className="text-right px-4 py-2 text-gray-600 dark:text-gray-400 font-medium">
                        Prescripciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topDoctors.map((d, i) => (
                      <tr key={d.doctorId} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <td className="px-4 py-2 text-gray-400 dark:text-gray-500">{i + 1}</td>
                        <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{d.name}</td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-gray-100">
                          {d.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos en el período seleccionado.</p>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Prescripciones por Día
            </h2>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : metrics && metrics.byDay.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-400 font-medium">Fecha</th>
                      <th className="text-right px-4 py-2 text-gray-600 dark:text-gray-400 font-medium">
                        Prescripciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.byDay.map((d) => (
                      <tr key={d.date} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                          {new Date(d.date + 'T00:00:00').toLocaleDateString('es-ES', {
                            dateStyle: 'medium',
                          })}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-gray-100">{d.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos en el período seleccionado.</p>
            )}
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}

export default function AdminPage() {
  return (
    <Suspense>
      <AdminPageContent />
    </Suspense>
  );
}
