'use client'

import { useState } from 'react'

const otsMock = [
  { id: 'OT-2025-047', equipo: 'Desfibrilador EQ-007', tipo: 'calibracion', prioridad: 'urgente', tecnico: 'Ing. Salcedo', estado: 'abierta', fecha: '29 Abr 2025', descripcion: 'Calibración correctiva — vencida desde 15 Abr 2025' },
  { id: 'OT-2025-046', equipo: 'Bomba Infusión EQ-015', tipo: 'correctivo', prioridad: 'alta', tecnico: 'TechMed S.A.S', estado: 'en_proceso', fecha: '27 Abr 2025', descripcion: 'Falla en alarma de oclusión — revisión urgente' },
  { id: 'OT-2025-045', equipo: 'Monitor EQ-004', tipo: 'preventivo', prioridad: 'normal', tecnico: 'Ing. Salcedo', estado: 'programada', fecha: '02 May 2025', descripcion: 'Mantenimiento preventivo mensual programado' },
  { id: 'OT-2025-044', equipo: 'Autoclave EQ-021', tipo: 'calibracion', prioridad: 'normal', tecnico: 'TechMed S.A.S', estado: 'programada', fecha: '05 May 2025', descripcion: 'Validación de ciclo de esterilización semestral' },
  { id: 'OT-2025-043', equipo: 'Rayos X EQ-018', tipo: 'preventivo', prioridad: 'normal', tecnico: 'PhilipsCare', estado: 'completada', fecha: '20 Abr 2025', descripcion: 'Revisión anual completada exitosamente' },
]

type OT = typeof otsMock[0]

export default function OrdenesPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [ots, setOts] = useState<OT[]>(otsMock)
  const [form, setForm] = useState({ equipo: '', tipo: 'preventivo', prioridad: 'normal', tecnico: '', descripcion: '', fecha: '' })
  const [guardado, setGuardado] = useState(false)

  const colorEstado = (e: string) => {
    if (e === 'abierta') return { bg: '#FEF2F2', text: '#DC2626' }
    if (e === 'en_proceso') return { bg: '#EFF6FF', text: '#1D4ED8' }
    if (e === 'programada') return { bg: '#FFFBEB', text: '#D97706' }
    return { bg: '#F0FDF4', text: '#16A34A' }
  }

  const colorPrioridad = (p: string) => {
    if (p === 'urgente') return '#DC2626'
    if (p === 'alta') return '#D97706'
    return '#16A34A'
  }

  const crearOT = () => {
    if (!form.equipo || !form.tecnico) return
    const nueva: OT = {
      id: `OT-2025-0${48 + ots.length}`,
      equipo: form.equipo,
      tipo: form.tipo,
      prioridad: form.prioridad,
      tecnico: form.tecnico,
      estado: 'programada',
      fecha: form.fecha || new Date().toLocaleDateString('es-CO'),
      descripcion: form.descripcion,
    }
    setOts([nueva, ...ots])
    setGuardado(true)
    setMostrarForm(false)
    setForm({ equipo: '', tipo: 'preventivo', prioridad: 'normal', tecnico: '', descripcion: '', fecha: '' })
    setTimeout(() => setGuardado(false), 3000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🔩 Generación de Órdenes de Trabajo</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>OTs · Mantenimiento · Calibración · Decreto 4725/2005</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)}
          style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          {mostrarForm ? '✕ Cancelar' : '+ Nueva OT'}
        </button>
      </div>

      {guardado && (
        <div style={{ background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#16A34A', fontWeight: '600' }}>
          ✅ Orden de trabajo creada exitosamente y asignada al técnico
        </div>
      )}

      {mostrarForm && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📋 Nueva Orden de Trabajo</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            {([
              { label: 'Equipo', key: 'equipo', placeholder: 'Ej: Desfibrilador EQ-007', type: 'text' },
              { label: 'Técnico responsable', key: 'tecnico', placeholder: 'Ing. Salcedo / TechMed...', type: 'text' },
            ] as const).map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder} type={f.type}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Tipo</label>
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
                {[['preventivo', 'Preventivo'], ['correctivo', 'Correctivo'], ['calibracion', 'Calibración'], ['metrologia', 'Metrología']].map(([val, lab]) => (
                  <option key={val} value={val}>{lab}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Prioridad</label>
              <select value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
                {[['normal', 'Normal'], ['alta', 'Alta'], ['urgente', 'Urgente — Crítico']].map(([val, lab]) => (
                  <option key={val} value={val}>{lab}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Fecha programada</label>
              <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Descripción del trabajo</label>
            <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción detallada del trabajo a realizar..."
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '80px' }} />
          </div>
          <button onClick={crearOT}
            style={{ padding: '10px 24px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            🔩 Crear Orden de Trabajo
          </button>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8ECF0' }}>
          <span style={{ fontSize: '14px', fontWeight: '700' }}>📋 Órdenes activas — {ots.filter(o => o.estado !== 'completada').length} pendientes</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              {['OT', 'Equipo', 'Tipo', 'Prioridad', 'Técnico', 'Fecha', 'Estado', 'Descripción'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ots.map(ot => {
              const ec = colorEstado(ot.estado)
              return (
                <tr key={ot.id} style={{ borderBottom: '1px solid #E8ECF0' }}>
                  <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#C74634', fontWeight: '700' }}>{ot.id}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{ot.equipo}</td>
                  <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: '700' }}>{ot.tipo}</span></td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: colorPrioridad(ot.prioridad) }}>
                      {'★'.repeat(ot.prioridad === 'urgente' ? 3 : ot.prioridad === 'alta' ? 2 : 1)} {ot.prioridad}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5F6B7A' }}>{ot.tecnico}</td>
                  <td style={{ padding: '11px 14px', fontSize: '11px', color: '#5F6B7A', fontFamily: 'monospace' }}>{ot.fecha}</td>
                  <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: ec.bg, color: ec.text }}>{ot.estado.replace('_', ' ')}</span></td>
                  <td style={{ padding: '11px 14px', fontSize: '11px', color: '#5F6B7A', maxWidth: '200px' }}>{ot.descripcion}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
