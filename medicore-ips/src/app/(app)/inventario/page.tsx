'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

type Tab = 'equipos' | 'medicamentos' | 'insumos' | 'activos'

const TABS: { key: Tab; label: string }[] = [
  { key: 'equipos', label: '🔬 Equipos médicos' },
  { key: 'medicamentos', label: '💊 Medicamentos' },
  { key: 'insumos', label: '🧴 Insumos' },
  { key: 'activos', label: '🏢 Activos fijos' },
]

const COLS_POR_TAB: Record<Tab, string[]> = {
  equipos: ['Ítem', 'Categoría', 'Cantidad', 'Unidad', 'Ubicación', 'Estado', 'Valor unitario', 'Acciones'],
  medicamentos: ['Ítem', 'Categoría', 'Cantidad', 'Unidad', 'Ubicación', 'Vencimiento', 'Valor unitario', 'Acciones'],
  insumos: ['Ítem', 'Categoría', 'Cantidad', 'Unidad', 'Ubicación', 'Estado', 'Valor unitario', 'Acciones'],
  activos: ['Ítem', 'Categoría', 'Cantidad', 'Unidad', 'Ubicación', 'Estado', 'Valor unitario', 'Acciones'],
}

interface FormItem { nombre: string; categoria: string; cantidad: string; unidad: string; ubicacion: string; valorUnitario: string; proveedor: string; vencimiento: string }
const VACIO: FormItem = { nombre: '', categoria: '', cantidad: '', unidad: 'Unidad', ubicacion: '', valorUnitario: '', proveedor: '', vencimiento: '' }

export default function InventarioPage() {
  const [tab, setTab] = useState<Tab>('equipos')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormItem>({ ...VACIO })

  const guardar = () => {
    if (!form.nombre.trim()) { toast.error('El nombre del ítem es obligatorio'); return }
    toast.success('Ítem agregado al inventario (demo) — conecta Oracle para persistir')
    setModal(false)
    setForm({ ...VACIO })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🏭 Inventario General</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Control de activos y suministros · Res. 914/2025</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Agregar ítem
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '8px 14px', borderRadius: '7px', border: `1.5px solid ${tab === t.key ? '#C74634' : '#E8ECF0'}`, background: tab === t.key ? '#FFF5F3' : '#fff', color: tab === t.key ? '#C74634' : '#5F6B7A', fontWeight: tab === t.key ? '700' : '500', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              {COLS_POR_TAB[tab].map(c => (
                <th key={c} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={COLS_POR_TAB[tab].length} style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏭</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Sin registros en esta categoría — agrega el primero con + Agregar ítem</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>🏭 Nuevo ítem — {TABS.find(t => t.key === tab)?.label}</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={LBL}>Nombre del ítem *</label><input style={INP} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del ítem" /></div>
              <div><label style={LBL}>Categoría</label><input style={INP} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} placeholder="Categoría del ítem" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Cantidad</label><input type="number" style={INP} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} placeholder="0" min="0" /></div>
                <div><label style={LBL}>Unidad</label>
                  <select style={INP} value={form.unidad} onChange={e => setForm({ ...form, unidad: e.target.value })}>
                    {['Unidad', 'Caja', 'Frasco', 'Ampolla', 'Rollo', 'Par', 'Kit'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={LBL}>Ubicación</label><input style={INP} value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} placeholder="Bodega, sala, ubicación..." /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Valor unitario ($)</label><input type="number" style={INP} value={form.valorUnitario} onChange={e => setForm({ ...form, valorUnitario: e.target.value })} placeholder="Valor en COP" min="0" /></div>
                <div><label style={LBL}>Fecha vencimiento</label><input type="date" style={INP} value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} /></div>
              </div>
              <div><label style={LBL}>Proveedor</label><input style={INP} value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} placeholder="Nombre del proveedor" /></div>
              <button onClick={guardar} style={{ padding: '11px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                Agregar al inventario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
