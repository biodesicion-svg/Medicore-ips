'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'

interface ChartsProps {
  rol: string
}

const dataCitas = [
  { dia: 'Lun', citas: 38 }, { dia: 'Mar', citas: 45 }, { dia: 'Mié', citas: 42 },
  { dia: 'Jue', citas: 51 }, { dia: 'Vie', citas: 39 }, { dia: 'Sáb', citas: 28 }, { dia: 'Hoy', citas: 48 },
]

const dataEsp = [
  { name: 'Med. General', value: 35, color: '#C74634' },
  { name: 'Pediatría', value: 20, color: '#F46800' },
  { name: 'Cardiología', value: 15, color: '#1D4ED8' },
  { name: 'Ortopedia', value: 12, color: '#16A34A' },
  { name: 'Ginecología', value: 10, color: '#7C3AED' },
  { name: 'Otros', value: 8, color: '#9CA3AF' },
]

const dataFact = [
  { mes: 'Ene', valor: 42 }, { mes: 'Feb', valor: 48 }, { mes: 'Mar', valor: 51 },
  { mes: 'Abr', valor: 45 }, { mes: 'May', valor: 58 }, { mes: 'Jun', valor: 62 },
  { mes: 'Jul', valor: 55 }, { mes: 'Ago', valor: 68 }, { mes: 'Sep', valor: 71 },
  { mes: 'Oct', valor: 65 }, { mes: 'Nov', valor: 78 }, { mes: 'Dic', valor: 82 },
]

export default function DashboardCharts({ rol }: ChartsProps) {
  if (rol !== 'director') return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>

      <div style={{ background: '#ffffff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>📈 Citas — 7 días</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={dataCitas} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="dia" tick={{ fontSize: 9, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #E8ECF0' }} />
            <Bar dataKey="citas" fill="#C74634" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>🏥 Por especialidad</div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={dataEsp} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
              {dataEsp.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #E8ECF0' }} formatter={(v) => [`${v}%`, '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>💰 Facturación 2025</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={dataFact} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9CA3AF', fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #E8ECF0' }} formatter={(v) => [`$${v}M`, 'Facturación']} />
            <Line type="monotone" dataKey="valor" stroke="#C74634" strokeWidth={2} dot={{ r: 3, fill: '#C74634' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
