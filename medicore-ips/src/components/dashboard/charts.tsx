'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts'

const dataCitas = [
  { dia: 'Lun', citas: 38 }, { dia: 'Mar', citas: 45 },
  { dia: 'Mié', citas: 42 }, { dia: 'Jue', citas: 51 },
  { dia: 'Vie', citas: 39 }, { dia: 'Sáb', citas: 28 },
  { dia: 'Hoy', citas: 48 },
]

const dataEsp = [
  { name: 'Med. General', value: 35, color: '#2563EB' },
  { name: 'Pediatría',    value: 20, color: '#059669' },
  { name: 'Cardiología',  value: 15, color: '#7C3AED' },
  { name: 'Ortopedia',    value: 12, color: '#D97706' },
  { name: 'Ginecología',  value: 10, color: '#0891B2' },
  { name: 'Otros',        value: 8,  color: '#94A3B8' },
]

const dataFact = [
  { mes: 'Ene', valor: 42 }, { mes: 'Feb', valor: 48 },
  { mes: 'Mar', valor: 51 }, { mes: 'Abr', valor: 45 },
  { mes: 'May', valor: 58 }, { mes: 'Jun', valor: 62 },
  { mes: 'Jul', valor: 55 }, { mes: 'Ago', valor: 68 },
  { mes: 'Sep', valor: 71 }, { mes: 'Oct', valor: 65 },
  { mes: 'Nov', valor: 78 }, { mes: 'Dic', valor: 82 },
]

const tooltipStyle = {
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-md)',
  fontFamily: 'Inter, sans-serif',
}

const axisStyle = {
  fontSize: 11,
  fill: '#94A3B8',
  fontFamily: 'monospace',
}

interface ChartsProps { rol: string }

export default function DashboardCharts({ rol }: ChartsProps) {
  if (rol !== 'director') return null

  const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>

      {/* Citas 7 días */}
      <div style={cardStyle}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
            Citas — últimos 7 días
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Consultas agendadas por día
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={dataCitas} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="dia" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#F1F5F9' }} />
            <Bar dataKey="citas" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Especialidades */}
      <div style={cardStyle}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
            Atenciones por especialidad
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Distribución del mes actual
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={dataEsp} cx="40%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" paddingAngle={2}>
              {dataEsp.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, '']} />
            <Legend
              layout="vertical" align="right" verticalAlign="middle"
              iconType="circle" iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#64748B' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Facturación */}
      <div style={cardStyle}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
            Facturación 2025
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Ingresos mensuales en millones COP
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={dataFact} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="mes" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => [`$${v}M`, 'Facturación']} />
            <Line
              type="monotone" dataKey="valor"
              stroke="#2563EB" strokeWidth={2}
              dot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
