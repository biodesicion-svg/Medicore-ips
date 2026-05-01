'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

interface FormOT { equipo: string; tipo: string; prioridad: string; tecnico: string; fecha: string; descripcion: string; horas: string; costo: string }
const VACIO: FormOT = { equipo: '', tipo: 'preventivo', prioridad: 'normal', tecnico: '', fecha: '', descripcion: '', horas: '', costo: '' }

const KPIS = [
  { label: 'OTs abiertas', value: '0', icon: '🔧', color: '#1D4ED8' },
  { label: 'Completadas este mes', value: '0', icon: '✅', color: '#16A34A' },
  { label: 'Calibraciones vencidas', value: '0', icon: '⚠️', color: '#D97706' },
  { label: 'Costo del mes', value: '$0', icon: '💰', color: '#7C3AED' },
]

export default function MantenimientoPage() {
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [form, setForm] = useState<FormOT>({ ...VACIO })

  const guardar = () => {
    if (!form.equipo.trim() || !form.tecnico.trim()) { toast.error('Equipo y técnico son obligatorios'); return }
    toast.success('Orden de trabajo creada (demo) — conecta Oracle para persistir')
    setPanelAbierto(false)
    setForm({ ...VACIO })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🔧 Mantenimiento Biomédico</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Decreto 4725/2005 · Res. 914/2025 · Órdenes de trabajo</p>
        </div>
        <button onClick={() => setPanelAbierto(!panelAbierto)}
          style={{ padding: '9px 18px', background: panelAbierto ? '#fff' : '#C74634', color: panelAbierto ? '#C74634' : '#fff', border: `1.5px solid ${panelAbierto ? '#C74634' : 'transparent'}`, borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          {panelAbierto ? '✕ Cerrar' : '+ Nueva OT'}
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {KPIS.map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '20px', marginTop: '4px' }}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Tabla */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['OT', 'Equipo', 'Tipo', 'Prioridad', 'Técnico', 'Fecha prog.', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔧</div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF' }}>No hay órdenes de trabajo. Crea la primera con + Nueva OT</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel lateral */}
        {panelAbierto && (
          <div style={{ width: '320px', flexShrink: 0, background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px', height: 'fit-content' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px' }}>📋 Nueva Orden de Trabajo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={LBL}>Equipo *</label><input style={INP} value={form.equipo} onChange={e => setForm({ ...form, equipo: e.target.value })} placeholder="Nombre o código del equipo" /></div>
              <div><label style={LBL}>Tipo</label>
                <select style={INP} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  {['preventivo', 'correctivo', 'calibracion', 'metrologia', 'tecnovigilancia'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div><label style={LBL}>Prioridad</label>
                <select style={INP} value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })}>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente — Crítico</option>
                </select>
              </div>
              <div><label style={LBL}>Técnico responsable *</label><input style={INP} value={form.tecnico} onChange={e => setForm({ ...form, tecnico: e.target.value })} placeholder="Nombre del técnico" /></div>
              <div><label style={LBL}>Fecha programada</label><input type="date" style={INP} value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
              <div><label style={LBL}>Descripción</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción del trabajo a realizar..." /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><label style={LBL}>Horas est.</label><input type="number" style={INP} value={form.horas} onChange={e => setForm({ ...form, horas: e.target.value })} placeholder="Horas" min="0" /></div>
                <div><label style={LBL}>Costo est. ($)</label><input type="number" style={INP} value={form.costo} onChange={e => setForm({ ...form, costo: e.target.value })} placeholder="COP" min="0" /></div>
              </div>
              <button onClick={guardar} style={{ padding: '10px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                Crear OT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
