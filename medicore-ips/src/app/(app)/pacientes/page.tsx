'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { EPS_LISTA } from '@/lib/constants'

interface Paciente {
  id: string
  nombre: string
  apellido: string
  tipo_documento: string
  documento: string
  fecha_nac?: string
  eps?: string
  telefono?: string
  email?: string
  grupo_sanguineo?: string
  sexo?: string
  direccion?: string
  alergias?: string
  activo: boolean
  created_at: string
}

function calcularEdad(fechaNac?: string): string {
  if (!fechaNac) return '—'
  const hoy = new Date()
  const nac = new Date(fechaNac)
  const edad = hoy.getFullYear() - nac.getFullYear()
  return `${edad} años`
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filtrados, setFiltrados] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', tipo_documento: 'CC', documento: '',
    fecha_nac: '', sexo: '', eps: '', telefono: '', email: '',
    grupo_sanguineo: '', direccion: '', alergias: ''
  })

  useEffect(() => {
    cargarPacientes()
  }, [])

  useEffect(() => {
    const b = busqueda.toLowerCase()
    setFiltrados(pacientes.filter(p =>
      p.nombre.toLowerCase().includes(b) ||
      p.apellido.toLowerCase().includes(b) ||
      p.documento.includes(b) ||
      (p.telefono || '').includes(b)
    ))
  }, [busqueda, pacientes])

  async function cargarPacientes() {
    setCargando(true)
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setPacientes(data)
      setFiltrados(data)
    }
    setCargando(false)
  }

  async function guardarPaciente() {
    if (!form.nombre || !form.apellido || !form.documento) {
      toast.error('Nombre, apellido y documento son obligatorios')
      return
    }
    setGuardando(true)
    const { error } = await supabase.from('pacientes').insert([{
      ...form, activo: true
    }])
    if (error) {
      toast.error('Error al guardar: ' + error.message)
    } else {
      toast.success('Paciente registrado correctamente')
      setModalAbierto(false)
      setForm({ nombre: '', apellido: '', tipo_documento: 'CC', documento: '', fecha_nac: '', sexo: '', eps: '', telefono: '', email: '', grupo_sanguineo: '', direccion: '', alergias: '' })
      cargarPacientes()
    }
    setGuardando(false)
  }

  const inp = (field: string, label: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>{label}</label>
      <input type={type} placeholder={placeholder}
        value={form[field as keyof typeof form]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA' }}
        onFocus={e => e.target.style.borderColor = '#C74634'}
        onBlur={e => e.target.style.borderColor = '#E8ECF0'}
      />
    </div>
  )

  const sel = (field: string, label: string, options: string[]) => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>{label}</label>
      <select value={form[field as keyof typeof form]} onChange={e => setForm({ ...form, [field]: e.target.value })}
        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA' }}>
        <option value="">Seleccionar...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>👥 Gestión de Pacientes</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Ley 1581/2012 · Habeas Data · {pacientes.length} registros en Supabase</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Buscar por nombre, documento o teléfono..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 14px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '280px', background: '#F5F7FA' }}
            onFocus={e => e.target.style.borderColor = '#C74634'}
            onBlur={e => e.target.style.borderColor = '#E8ECF0'}
          />
          <button onClick={() => setModalAbierto(true)}
            style={{ padding: '8px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            + Nuevo paciente
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {cargando ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>Cargando pacientes desde Supabase...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '6px' }}>
              {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay pacientes registrados'}
            </div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
              {busqueda ? 'Intenta con otro término' : 'Agrega el primero con + Nuevo paciente'}
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['Paciente', 'Documento', 'EPS', 'Edad', 'Teléfono', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', borderBottom: '1px solid #E8ECF0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #E8ECF0', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFF5F3'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'}>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{p.nombre} {p.apellido}</div>
                    {p.grupo_sanguineo && <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>Grupo: {p.grupo_sanguineo}</div>}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#5F6B7A' }}>{p.tipo_documento} {p.documento}</div>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#5F6B7A' }}>{p.eps || '—'}</td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#5F6B7A', fontFamily: 'monospace' }}>{calcularEdad(p.fecha_nac)}</td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#5F6B7A', fontFamily: 'monospace' }}>{p.telefono || '—'}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: p.activo ? '#F0FDF4' : '#FEF2F2', color: p.activo ? '#16A34A' : '#DC2626' }}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '4px 10px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C74634'; e.currentTarget.style.color = '#C74634' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8ECF0'; e.currentTarget.style.color = '#5F6B7A' }}>
                        HC
                      </button>
                      <button style={{ padding: '4px 10px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C74634'; e.currentTarget.style.color = '#C74634' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8ECF0'; e.currentTarget.style.color = '#5F6B7A' }}>
                        Cita
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false) }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '580px', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <span style={{ fontSize: '20px' }}>🧑‍⚕️</span>
              <div style={{ fontSize: '17px', fontWeight: '800', flex: 1 }}>Nuevo Paciente</div>
              <button onClick={() => setModalAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {inp('nombre', 'Nombres', 'text', 'Nombres completos')}
                {inp('apellido', 'Apellidos', 'text', 'Apellidos completos')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                {sel('tipo_documento', 'Tipo doc.', ['CC', 'CE', 'TI', 'PA', 'RC'])}
                {inp('documento', 'Número documento', 'text', '1.234.567.890')}
                {inp('fecha_nac', 'Fecha nacimiento', 'date')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {sel('sexo', 'Sexo', ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'])}
                {sel('grupo_sanguineo', 'Grupo sanguíneo', ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'])}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {sel('eps', 'EPS / Aseguradora', EPS_LISTA)}
                {inp('telefono', 'Teléfono', 'tel', '+57 300 000 0000')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {inp('email', 'Email', 'email', 'correo@ejemplo.com')}
                {inp('direccion', 'Dirección', 'text', 'Dirección de residencia')}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>Alergias conocidas</label>
                <textarea value={form.alergias} onChange={e => setForm({ ...form, alergias: e.target.value })}
                  placeholder="Medicamentos, alimentos u otras alergias..."
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '70px', background: '#F5F7FA' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace', background: '#F5F7FA', padding: '8px 12px', borderRadius: '6px' }}>
                🔒 Datos protegidos bajo Ley 1581/2012 — Habeas Data Colombia
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalAbierto(false)}
                  style={{ padding: '9px 18px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}>
                  Cancelar
                </button>
                <button onClick={guardarPaciente} disabled={guardando}
                  style={{ padding: '9px 18px', background: guardando ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {guardando ? 'Guardando...' : '💾 Registrar paciente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
