'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend } from 'recharts'

const equiposList = [
  { id: 'EQ-001', nombre: 'Ventilador Mecánico UCI' },
  { id: 'EQ-004', nombre: 'Monitor Multiparámetro' },
  { id: 'EQ-007', nombre: 'Desfibrilador Bifásico' },
  { id: 'EQ-012', nombre: 'Ecógrafo Portátil' },
  { id: 'EQ-021', nombre: 'Autoclave 120L' },
]

const dataGeneral = [
  { mes: 'Ene', disponibilidad: 94.2, mantenimientos: 8, fallas: 2, costo: 3.2 },
  { mes: 'Feb', disponibilidad: 91.8, mantenimientos: 6, fallas: 4, costo: 4.8 },
  { mes: 'Mar', disponibilidad: 93.5, mantenimientos: 9, fallas: 3, costo: 3.9 },
  { mes: 'Abr', disponibilidad: 89.7, mantenimientos: 11, fallas: 5, costo: 5.2 },
  { mes: 'May', disponibilidad: 92.1, mantenimientos: 7, fallas: 2, costo: 3.4 },
  { mes: 'Jun', disponibilidad: 95.3, mantenimientos: 5, fallas: 1, costo: 2.8 },
]

const dataRadar = [
  { indicador: 'Disponibilidad', EQ001: 98, EQ004: 91, EQ007: 72, EQ012: 96, EQ021: 89 },
  { indicador: 'Mantenimiento', EQ001: 95, EQ004: 80, EQ007: 60, EQ012: 88, EQ021: 82 },
  { indicador: 'Calibración', EQ001: 90, EQ004: 75, EQ007: 40, EQ012: 92, EQ021: 70 },
  { indicador: 'Vida útil', EQ001: 82, EQ004: 45, EQ007: 22, EQ012: 70, EQ021: 60 },
  { indicador: 'SLA', EQ001: 98, EQ004: 92, EQ007: 85, EQ012: 96, EQ021: 90 },
]

const dataIndividual: Record<string, { mes: string; disponibilidad: number; fallas: number; costo: number }[]> = {
  'EQ-001': [
    { mes: 'Ene', disponibilidad: 99, fallas: 0, costo: 1.2 }, { mes: 'Feb', disponibilidad: 98, fallas: 0, costo: 1.1 },
    { mes: 'Mar', disponibilidad: 98, fallas: 1, costo: 1.8 }, { mes: 'Abr', disponibilidad: 97, fallas: 0, costo: 1.2 },
    { mes: 'May', disponibilidad: 99, fallas: 0, costo: 1.1 }, { mes: 'Jun', disponibilidad: 98, fallas: 0, costo: 1.0 },
  ],
  'EQ-004': [
    { mes: 'Ene', disponibilidad: 94, fallas: 1, costo: 0.8 }, { mes: 'Feb', disponibilidad: 92, fallas: 2, costo: 1.4 },
    { mes: 'Mar', disponibilidad: 90, fallas: 1, costo: 0.9 }, { mes: 'Abr', disponibilidad: 88, fallas: 3, costo: 2.1 },
    { mes: 'May', disponibilidad: 91, fallas: 1, costo: 0.8 }, { mes: 'Jun', disponibilidad: 93, fallas: 0, costo: 0.6 },
  ],
  'EQ-007': [
    { mes: 'Ene', disponibilidad: 85, fallas: 2, costo: 2.1 }, { mes: 'Feb', disponibilidad: 80, fallas: 3, costo: 3.2 },
    { mes: 'Mar', disponibilidad: 78, fallas: 2, costo: 2.8 }, { mes: 'Abr', disponibilidad: 72, fallas: 4, costo: 4.1 },
    { mes: 'May', disponibilidad: 70, fallas: 3, costo: 3.6 }, { mes: 'Jun', disponibilidad: 68, fallas: 5, costo: 5.2 },
  ],
  'EQ-012': [
    { mes: 'Ene', disponibilidad: 97, fallas: 0, costo: 0.6 }, { mes: 'Feb', disponibilidad: 96, fallas: 1, costo: 0.9 },
    { mes: 'Mar', disponibilidad: 95, fallas: 0, costo: 0.6 }, { mes: 'Abr', disponibilidad: 96, fallas: 0, costo: 0.5 },
    { mes: 'May', disponibilidad: 97, fallas: 0, costo: 0.6 }, { mes: 'Jun', disponibilidad: 96, fallas: 1, costo: 0.8 },
  ],
  'EQ-021': [
    { mes: 'Ene', disponibilidad: 91, fallas: 1, costo: 0.7 }, { mes: 'Feb', disponibilidad: 89, fallas: 2, costo: 1.2 },
    { mes: 'Mar', disponibilidad: 90, fallas: 1, costo: 0.8 }, { mes: 'Abr', disponibilidad: 87, fallas: 2, costo: 1.4 },
    { mes: 'May', disponibilidad: 89, fallas: 1, costo: 0.9 }, { mes: 'Jun', disponibilidad: 91, fallas: 0, costo: 0.6 },
  ],
}

const COLORS = ['#C74634', '#1D4ED8', '#16A34A', '#D97706', '#7C3AED']

export default function ComportamientoPage() {
  const [vista, setVista] = useState<'general' | 'individual'>('general')
  const [equipoSel, setEquipoSel] = useState('EQ-007')

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📈 Comportamiento de Equipos</h1>
        <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Análisis histórico general e individual · ISO 55001</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['general', 'individual'] as const).map(v => (
          <button key={v} onClick={() => setVista(v)}
            style={{ padding: '8px 18px', borderRadius: '7px', border: `1.5px solid ${vista === v ? '#C74634' : '#E8ECF0'}`, background: vista === v ? '#FFF5F3' : '#fff', color: vista === v ? '#C74634' : '#5F6B7A', fontWeight: vista === v ? '700' : '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {v === 'general' ? '📊 Comportamiento general' : '🔍 Comportamiento individual'}
          </button>
        ))}
      </div>

      {vista === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>📡 Disponibilidad global mensual</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={dataGeneral}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Disponibilidad']} contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                  <Line type="monotone" dataKey="disponibilidad" stroke="#C74634" strokeWidth={2.5} dot={{ r: 4, fill: '#C74634' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>🔧 Mantenimientos y fallas por mes</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dataGeneral}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                  <Bar dataKey="mantenimientos" fill="#1D4ED8" radius={[3, 3, 0, 0]} name="Mantenimientos" />
                  <Bar dataKey="fallas" fill="#DC2626" radius={[3, 3, 0, 0]} name="Fallas" />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>🕸️ Radar comparativo — todos los equipos</div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={dataRadar}>
                <PolarGrid stroke="#E8ECF0" />
                <PolarAngleAxis dataKey="indicador" tick={{ fontSize: 11, fill: '#5F6B7A', fontFamily: 'monospace' }} />
                {equiposList.map((eq, i) => (
                  <Radar key={eq.id} name={eq.id} dataKey={eq.id.replace('-', '')} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.08} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {vista === 'individual' && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {equiposList.map(eq => (
              <div key={eq.id} onClick={() => setEquipoSel(eq.id)}
                style={{ background: equipoSel === eq.id ? '#FFF5F3' : '#fff', border: `1.5px solid ${equipoSel === eq.id ? '#C74634' : '#E8ECF0'}`, borderRadius: '8px', padding: '12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'monospace' }}>{eq.id}</div>
                <div style={{ fontSize: '11px', color: '#5F6B7A', marginTop: '2px' }}>{eq.nombre}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>
                📡 Disponibilidad — {equiposList.find(e => e.id === equipoSel)?.nombre}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={dataIndividual[equipoSel] || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Disponibilidad']} contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                  <Line type="monotone" dataKey="disponibilidad" stroke="#C74634" strokeWidth={2.5} dot={{ r: 4, fill: '#C74634' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>⚠️ Fallas por mes</div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={dataIndividual[equipoSel] || []}>
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                    <Bar dataKey="fallas" fill="#DC2626" radius={[3, 3, 0, 0]} name="Fallas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>💰 Costo mantto. ($M)</div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={dataIndividual[equipoSel] || []}>
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                    <Tooltip formatter={(v) => [`$${v}M`, 'Costo']} contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                    <Bar dataKey="costo" fill="#F46800" radius={[3, 3, 0, 0]} name="Costo" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
