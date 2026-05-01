'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

const TH_STYLE: CSSProperties = { padding: '10px 16px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }

type Tab = 'todas' | 'sinfirmar' | 'examenes' | 'analisis'

interface Diagnostico { codigo: string; descripcion: string }
interface FormHC {
  paciente: string; ta: string; fc: string; spo2: string; temp: string
  motivo: string; anamnesis: string; examenFisico: string
  plan: string
}
const HC_VACIO: FormHC = { paciente: '', ta: '', fc: '', spo2: '', temp: '', motivo: '', anamnesis: '', examenFisico: '', plan: '' }

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', borderRadius: '7px', border: `1.5px solid ${active ? '#C74634' : '#E8ECF0'}`, background: active ? '#FFF5F3' : '#fff', color: active ? '#C74634' : '#5F6B7A', fontWeight: active ? '700' : '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
      {children}
    </button>
  )
}

function TablaVacia({ cols, mensaje }: { cols: string[]; mensaje: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F5F7FA' }}>
            {cols.map(c => <th key={c} style={TH_STYLE}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={cols.length} style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{mensaje}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function HistoriaPage() {
  const [tab, setTab] = useState<Tab>('todas')
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormHC>({ ...HC_VACIO })
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [diagTemp, setDiagTemp] = useState({ codigo: '', descripcion: '' })

  const agregarDiag = () => {
    if (!diagTemp.codigo.trim()) return
    setDiagnosticos([...diagnosticos, { ...diagTemp }])
    setDiagTemp({ codigo: '', descripcion: '' })
  }

  const guardar = (firmar: boolean) => {
    if (!form.paciente.trim()) { toast.error('El paciente es obligatorio'); return }
    toast.success(firmar ? 'Historia clínica firmada digitalmente (demo)' : 'Borrador guardado (demo) — conecta Oracle para persistir')
    setModal(false)
    setForm({ ...HC_VACIO })
    setDiagnosticos([])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📋 Historia Clínica Electrónica</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Res. 3100/2019 · Ley 527/1999 · Historia clínica digital</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Nueva HC
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <TabBtn active={tab === 'todas'} onClick={() => setTab('todas')}>📋 Todas las HC</TabBtn>
        <TabBtn active={tab === 'sinfirmar'} onClick={() => setTab('sinfirmar')}>✍️ Sin firmar</TabBtn>
        <TabBtn active={tab === 'examenes'} onClick={() => setTab('examenes')}>🔬 Exámenes pendientes</TabBtn>
        <TabBtn active={tab === 'analisis'} onClick={() => setTab('analisis')}>📊 Análisis</TabBtn>
      </div>

      {tab === 'todas' && (
        <>
          <div style={{ marginBottom: '14px' }}>
            <input style={{ ...INP, maxWidth: '360px' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre o documento..." />
          </div>
          <TablaVacia
            cols={['Paciente', 'Documento', 'EPS', 'Fecha', 'Diagnóstico', 'Estado firma', 'Acciones']}
            mensaje="No hay historias clínicas registradas. Crea la primera con el botón + Nueva HC"
          />
        </>
      )}

      {tab === 'sinfirmar' && (
        <TablaVacia cols={['Paciente', 'HC ID', 'Médico', 'Fecha', 'Acciones']} mensaje="No hay historias clínicas pendientes de firma" />
      )}

      {tab === 'examenes' && (
        <TablaVacia cols={['Paciente', 'Examen', 'Solicitado por', 'Fecha', 'Laboratorio', 'Estado', 'Días espera']} mensaje="No hay exámenes pendientes" />
      )}

      {tab === 'analisis' && (
        <div>
          <div style={{ background: '#FFFBEB', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#D97706' }}>
            Conecta Oracle para ver el análisis epidemiológico de tu IPS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {['Diagnósticos más frecuentes', 'Distribución por edad', 'Tendencia de consultas', 'EPS por volumen'].map(titulo => (
              <div key={titulo} style={{ border: '2px dashed #E8ECF0', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📊</div>
                <div style={{ fontSize: '12px' }}>{titulo}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal nueva HC */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '640px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '92vh', overflow: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>📋 Nueva Historia Clínica</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={LBL}>Buscar paciente *</label><input style={INP} value={form.paciente} onChange={e => setForm({ ...form, paciente: e.target.value })} placeholder="Nombre o documento del paciente" /></div>

              <div>
                <label style={LBL}>Signos vitales</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['ta', 'TA (ej: 120/80 mmHg)'], ['fc', 'FC (lpm)'], ['spo2', 'SpO₂ (%)'], ['temp', 'Temperatura (°C)']].map(([k, ph]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#5F6B7A' }}>{ph}</span>
                      <input style={INP} value={form[k as keyof FormHC]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} />
                    </div>
                  ))}
                </div>
              </div>

              <div><label style={LBL}>Motivo de consulta</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} placeholder="Motivo de consulta del paciente..." /></div>
              <div><label style={LBL}>Anamnesis</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.anamnesis} onChange={e => setForm({ ...form, anamnesis: e.target.value })} placeholder="Historia y antecedentes relevantes..." /></div>
              <div><label style={LBL}>Examen físico</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.examenFisico} onChange={e => setForm({ ...form, examenFisico: e.target.value })} placeholder="Hallazgos del examen físico..." /></div>

              <div>
                <label style={LBL}>Diagnóstico CIE-10</label>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '8px', marginBottom: '8px' }}>
                  <input style={INP} value={diagTemp.codigo} onChange={e => setDiagTemp({ ...diagTemp, codigo: e.target.value })} placeholder="Código CIE-10" />
                  <input style={INP} value={diagTemp.descripcion} onChange={e => setDiagTemp({ ...diagTemp, descripcion: e.target.value })} placeholder="Descripción del diagnóstico" />
                  <button onClick={agregarDiag} style={{ padding: '9px 14px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Agregar</button>
                </div>
                {diagnosticos.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {diagnosticos.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EFF6FF', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '7px 12px' }}>
                        <span style={{ fontSize: '12px', color: '#1D4ED8' }}><strong>{d.codigo}</strong> — {d.descripcion}</span>
                        <button onClick={() => setDiagnosticos(diagnosticos.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '16px', lineHeight: 1 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div><label style={LBL}>Plan de manejo</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} placeholder="Plan terapéutico, medicamentos, recomendaciones..." /></div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '4px' }}>
                <button onClick={() => guardar(false)} style={{ padding: '11px', background: '#fff', color: '#1A1A2E', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  💾 Guardar borrador
                </button>
                <button onClick={() => guardar(true)} style={{ padding: '11px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✍️ Firmar digitalmente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
