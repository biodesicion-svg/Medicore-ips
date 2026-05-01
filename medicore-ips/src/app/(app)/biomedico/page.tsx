'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

type Tab = 'inventario' | 'repuestos'

interface FormEquipo {
  nombre: string; codigo: string; claseRiesgo: string; gmdn: string; invima: string
  marca: string; modelo: string; serie: string; fechaAdq: string; ubicacion: string
  frecMant: string; vidaUtil: string; proveedor: string; observaciones: string
}
const VACIO: FormEquipo = { nombre: '', codigo: '', claseRiesgo: 'Clase IIa', gmdn: '', invima: '', marca: '', modelo: '', serie: '', fechaAdq: '', ubicacion: '', frecMant: 'Anual', vidaUtil: '', proveedor: '', observaciones: '' }

function TablaVacia({ cols, mensaje }: { cols: string[]; mensaje: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F5F7FA' }}>
            {cols.map(c => <th key={c} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={cols.length} style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔬</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{mensaje}</div>
          </td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default function BiomedicoPage() {
  const [tab, setTab] = useState<Tab>('inventario')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormEquipo>({ ...VACIO })

  const guardar = () => {
    if (!form.nombre.trim() || !form.codigo.trim()) { toast.error('Nombre y código son obligatorios'); return }
    toast.success('Equipo registrado (demo) — conecta Oracle para persistir')
    setModal(false)
    setForm({ ...VACIO })
  }

  const f = (k: keyof FormEquipo, ph: string, tipo = 'text') => (
    <div><label style={LBL}>{ph}</label>
      <input type={tipo} style={INP} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} />
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🔬 Inventario de Equipos Biomédicos</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Decreto 4725/2005 · Res. 3100/2019 · Hoja de vida de equipos</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Nuevo equipo
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['inventario', 'repuestos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 16px', borderRadius: '7px', border: `1.5px solid ${tab === t ? '#C74634' : '#E8ECF0'}`, background: tab === t ? '#FFF5F3' : '#fff', color: tab === t ? '#C74634' : '#5F6B7A', fontWeight: tab === t ? '700' : '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {t === 'inventario' ? '🔬 Inventario completo' : '🔩 Repuestos'}
          </button>
        ))}
      </div>

      {tab === 'inventario' && (
        <TablaVacia
          cols={['Equipo', 'Código', 'Clase riesgo', 'INVIMA', 'Ubicación', 'Estado', 'Próx. mantto.', 'Calibración', 'Vida útil', 'Acciones']}
          mensaje="No hay equipos registrados en el inventario"
        />
      )}
      {tab === 'repuestos' && (
        <TablaVacia
          cols={['Repuesto', 'Compatible con', 'Stock actual', 'Stock mínimo', 'Estado', 'Proveedor', 'Acciones']}
          mensaje="No hay repuestos registrados"
        />
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '620px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '92vh', overflow: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>🔬 Nuevo equipo biomédico</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {f('nombre', 'Nombre del equipo *')}
                {f('codigo', 'Código interno (ej: EQ-001) *')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Clase de riesgo</label>
                  <select style={INP} value={form.claseRiesgo} onChange={e => setForm({ ...form, claseRiesgo: e.target.value })}>
                    {['Clase I', 'Clase IIa', 'Clase IIb', 'Clase III'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {f('gmdn', 'Código GMDN')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {f('invima', 'Registro INVIMA')}
                {f('marca', 'Marca')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {f('modelo', 'Modelo')}
                {f('serie', 'Número de serie')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {f('fechaAdq', 'Fecha de adquisición', 'date')}
                {f('ubicacion', 'Ubicación (ej: UCI Piso 2)')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Frecuencia de mantenimiento</label>
                  <select style={INP} value={form.frecMant} onChange={e => setForm({ ...form, frecMant: e.target.value })}>
                    {['Mensual', 'Trimestral', 'Semestral', 'Anual'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div><label style={LBL}>Vida útil (años)</label>
                  <input type="number" style={INP} value={form.vidaUtil} onChange={e => setForm({ ...form, vidaUtil: e.target.value })} placeholder="Años de vida útil" min="1" />
                </div>
              </div>
              {f('proveedor', 'Proveedor de mantenimiento')}
              <div><label style={LBL}>Observaciones</label>
                <textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} placeholder="Observaciones adicionales..." />
              </div>
              <button onClick={guardar} style={{ padding: '11px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                Registrar equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
