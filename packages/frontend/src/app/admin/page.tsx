'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getMetrics } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#10b981', '#f59e0b'];

interface Metrics {
  totals: { doctors: number; patients: number; prescriptions: number };
  byStatus: { pending: number; consumed: number };
  byDay: { date: string; count: number }[];
  topDoctors: { doctorId: string; name: string; count: number }[];
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMetrics()
      .then((data: any) => setMetrics(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  }, []);

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

  const statusData = [
    { name: 'Pendientes', value: metrics?.byStatus?.pending || 0 },
    { name: 'Consumidas', value: metrics?.byStatus?.consumed || 0 },
  ];

  const byDayData = metrics?.byDay?.length ? metrics.byDay : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Admin</h1>
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
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Dashboard</h2>

        {error && (
          <div className="p-3 rounded mb-4" style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text)' }}>{error}</div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div className="bg-card shadow rounded-lg p-6">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Doctores</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{metrics?.totals.doctors || 0}</p>
          </div>
          <div className="bg-card shadow rounded-lg p-6">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Pacientes</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{metrics?.totals.patients || 0}</p>
          </div>
          <div className="bg-card shadow rounded-lg p-6">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Prescripciones</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              {metrics?.totals.prescriptions || 0}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="bg-card shadow rounded-lg p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Por Estado</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card shadow rounded-lg p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Últimos 30 días</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} style={{ color: 'var(--color-text-muted)' }} />
                  <YAxis tick={{ fontSize: 12 }} style={{ color: 'var(--color-text-muted)' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-card shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Top Doctores</h3>
          <div className="space-y-2">
            {metrics?.topDoctors?.map((doc, index) => (
              <div key={doc.doctorId} className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
                <span style={{ color: 'var(--color-text)' }}>{index + 1}. {doc.name}</span>
                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{doc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}