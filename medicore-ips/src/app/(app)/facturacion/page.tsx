'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'
import { EPS_LISTA } from '@/lib/constants'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

const KPIS = [
  { label: 'Facturado este mes', value: '$0', icon: '💰', color: '#16A34A' },
  { label: 'Facturas emitidas', value: '0', icon: '📄', color: '#1D4ED8' },
  { label: 'Aceptadas DIAN', value: '0', icon: '✅', color: '#16A34A' },
  { label: 'Rechazadas', value: '0', icon: '❌', color: '#DC2626' },
]

interface Servicio { cups: string; descripcion: string; cantidad: number; valorUnitario: number }
interface FormFactura { paciente: string; eps: string; fecha: string; tipoPago: string; observaciones: string }
const FORM_VACIO: FormFactura = { paciente: '', eps: '', fecha: new Date().toISOString().split('T')[0], tipoPago: 'EPS', observaciones: '' }
const SVC_VACIO: Servicio = { cups: '', descripcion: '', cantidad: 1, valorUnitario: 0 }

export default function FacturacionPage() {
  const [tab, setTab] = useState<'facturas' | 'notas'>('facturas')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormFactura>({ ...FORM_VACIO })
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [svcTemp, setSvcTemp] = useState<Servicio>({ ...SVC_VACIO })

  const total = servicios.reduce((s, sv) => s + sv.cantidad * sv.valorUnitario, 0)

  const agregarServicio = () => {
    if (!svcTemp.cups.trim() || !svcTemp.descripcion.trim()) { toast.error('Código CUPS y descripción son obligatorios'); return }
    setServicios([...servicios, { ...svcTemp }])
    setSvcTemp({ ...SVC_VACIO })
  }

  const guardar = () => {
    if (!form.paciente.trim() || servicios.length === 0) { toast.error('Paciente y al menos un servicio son obligatorios'); return }
    toast.success('Factura generada (demo) — conecta Oracle/DIAN para enviar')
    setModal(false)
    setForm({ ...FORM_VACIO })
    setServicios([])
  }

  const fmt = (n: number) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>💳 Facturación Electrónica</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Res. 042/2020 · DIAN · Factura electrónica en salud</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Nueva factura
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {KPIS.map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '20px', marginTop: '4px' }}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {([['facturas', '📄 Facturas'], ['notas', '📝 Notas crédito']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '8px 16px', borderRadius: '7px', border: `1.5px solid ${tab === key ? '#C74634' : '#E8ECF0'}`, background: tab === key ? '#FFF5F3' : '#fff', color: tab === key ? '#C74634' : '#5F6B7A', fontWeight: tab === key ? '700' : '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              {['N° Factura', 'Paciente', 'EPS', 'Servicios', 'Valor total', 'Estado DIAN', 'CUFE', 'Fecha', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>💳</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>No hay facturas generadas. Crea la primera con + Nueva factura</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '640px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '92vh', overflow: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>💳 Nueva factura electrónica</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={LBL}>Paciente *</label><input style={INP} value={form.paciente} onChange={e => setForm({ ...form, paciente: e.target.value })} placeholder="Buscar paciente..." /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>EPS / Aseguradora</label>
                  <select style={INP} value={form.eps} onChange={e => setForm({ ...form, eps: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {EPS_LISTA.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div><label style={LBL}>Fecha de prestación</label><input type="date" style={INP} value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
              </div>

              {/* Servicios */}
              <div>
                <label style={LBL}>Servicios prestados *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 70px 100px auto', gap: '6px', marginBottom: '8px' }}>
                  <input style={INP} value={svcTemp.cups} onChange={e => setSvcTemp({ ...svcTemp, cups: e.target.value })} placeholder="CUPS" />
                  <input style={INP} value={svcTemp.descripcion} onChange={e => setSvcTemp({ ...svcTemp, descripcion: e.target.value })} placeholder="Descripción del servicio" />
                  <input type="number" style={INP} value={svcTemp.cantidad} onChange={e => setSvcTemp({ ...svcTemp, cantidad: Number(e.target.value) })} placeholder="Cant." min="1" />
                  <input type="number" style={INP} value={svcTemp.valorUnitario || ''} onChange={e => setSvcTemp({ ...svcTemp, valorUnitario: Number(e.target.value) })} placeholder="Valor" min="0" />
                  <button onClick={agregarServicio} style={{ padding: '9px 12px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Agregar</button>
                </div>
                {servicios.map((sv, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EFF6FF', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '7px 12px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#1D4ED8' }}><strong>{sv.cups}</strong> — {sv.descripcion} × {sv.cantidad} = {fmt(sv.cantidad * sv.valorUnitario)}</span>
                    <button onClick={() => setServicios(servicios.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '16px' }}>✕</button>
                  </div>
                ))}
                {servicios.length > 0 && (
                  <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>
                    Total: {fmt(total)}
                  </div>
                )}
              </div>

              <div><label style={LBL}>Tipo de pago</label>
                <select style={INP} value={form.tipoPago} onChange={e => setForm({ ...form, tipoPago: e.target.value })}>
                  {['EPS', 'Particular', 'Seguro'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={LBL}>Observaciones</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '60px' }} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} placeholder="Observaciones de la factura..." /></div>
              <button onClick={guardar} style={{ padding: '11px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                Generar factura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
