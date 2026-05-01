'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'
import { EPS_LISTA } from '@/lib/constants'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

type Filtro = 'todos' | 'activos' | 'eps'

interface FormPaciente {
  nombres: string; apellidos: string; tipoDoc: string; numDoc: string
  fechaNac: string; sexo: string; eps: string; telefono: string
  email: string; grupoSanguineo: string; direccion: string; alergias: string
}
const VACIO: FormPaciente = { nombres: '', apellidos: '', tipoDoc: 'CC', numDoc: '', fechaNac: '', sexo: '', eps: '', telefono: '', email: '', grupoSanguineo: '', direccion: '', alergias: '' }

export default function PacientesPage() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormPaciente>({ ...VACIO })

  const guardar = () => {
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.numDoc.trim()) {
      toast.error('Nombres, apellidos y documento son obligatorios')
      return
    }
    toast.success('Paciente registrado (demo) — conecta Oracle para persistir')
    setModal(false)
    setForm({ ...VACIO })
  }

  const FILTROS: { key: Filtro; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'activos', label: 'Activos' },
    { key: 'eps', label: 'Por EPS' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>👥 Gestión de Pacientes</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Ley 1581/2012 · Habeas Data · Protección de datos personales</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Nuevo paciente
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input style={{ ...INP, maxWidth: '320px' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre, documento o teléfono..." />
        <div style={{ display: 'flex', gap: '6px' }}>
          {FILTROS.map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              style={{ padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${filtro === f.key ? '#C74634' : '#E8ECF0'}`, background: filtro === f.key ? '#FFF5F3' : '#fff', color: filtro === f.key ? '#C74634' : '#5F6B7A', fontSize: '12px', fontWeight: filtro === f.key ? '700' : '500', cursor: 'pointer', fontFamily: 'inherit' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              {['Paciente', 'Documento', 'EPS', 'Edad', 'Teléfono', 'Última consulta', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  No hay pacientes registrados. Agrega el primero con + Nuevo paciente
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '92vh', overflow: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>👥 Nuevo paciente</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Nombres *</label><input style={INP} value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} placeholder="Nombres del paciente" /></div>
                <div><label style={LBL}>Apellidos *</label><input style={INP} value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} placeholder="Apellidos del paciente" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
                <div><label style={LBL}>Tipo documento</label>
                  <select style={INP} value={form.tipoDoc} onChange={e => setForm({ ...form, tipoDoc: e.target.value })}>
                    {['CC', 'CE', 'TI', 'PA', 'RC'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label style={LBL}>Número documento *</label><input style={INP} value={form.numDoc} onChange={e => setForm({ ...form, numDoc: e.target.value })} placeholder="Número de documento" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Fecha de nacimiento</label><input type="date" style={INP} value={form.fechaNac} onChange={e => setForm({ ...form, fechaNac: e.target.value })} /></div>
                <div><label style={LBL}>Sexo</label>
                  <select style={INP} value={form.sexo} onChange={e => setForm({ ...form, sexo: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>EPS</label>
                  <select style={INP} value={form.eps} onChange={e => setForm({ ...form, eps: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {EPS_LISTA.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div><label style={LBL}>Grupo sanguíneo</label>
                  <select style={INP} value={form.grupoSanguineo} onChange={e => setForm({ ...form, grupoSanguineo: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Teléfono</label><input type="tel" style={INP} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="Número de teléfono" /></div>
                <div><label style={LBL}>Email</label><input type="email" style={INP} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" /></div>
              </div>
              <div><label style={LBL}>Dirección</label><input style={INP} value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección de residencia" /></div>
              <div><label style={LBL}>Alergias conocidas</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '60px' }} value={form.alergias} onChange={e => setForm({ ...form, alergias: e.target.value })} placeholder="Describa las alergias conocidas (medicamentos, alimentos, etc.)" /></div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace', borderTop: '1px solid #E8ECF0', paddingTop: '10px' }}>
                🔒 Datos protegidos bajo Ley 1581/2012 — Habeas Data Colombia
              </div>
              <button onClick={guardar} style={{ padding: '11px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                Registrar paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
