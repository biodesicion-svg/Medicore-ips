'use client'

import { useState, useEffect } from 'react'

interface Paciente {
  id: string
  nombre: string
  apellido: string
  documento: string
  eps?: string
  telefono?: string
  activo: boolean
}

const MENU = [
  { id: 'info', icon: '👤', label: 'Mi información', color: '#2563EB' },
  { id: 'citas', icon: '📅', label: 'Citas médicas', color: '#059669' },
  { id: 'historia', icon: '📋', label: 'Historia clínica', color: '#7C3AED' },
  { id: 'incapacidades', icon: '🩹', label: 'Incapacidades', color: '#D97706' },
  { id: 'resultados', icon: '🧪', label: 'Resultados', color: '#0891B2' },
  { id: 'pagos', icon: '💳', label: 'Pagos', color: '#64748B' },
]

const ESPECIALIDADES = [
  'Medicina General', 'Cardiología', 'Pediatría', 'Ginecología',
  'Ortopedia', 'Neurología', 'Dermatología', 'Odontología',
  'Nutrición', 'Psicología', 'Oftalmología', 'Urología'
]

function generarHoras(): string[] {
  const horas: string[] = []
  for (let h = 7; h <= 16; h++) {
    for (const m of [0, 30]) {
      if (h === 16 && m === 30) continue
      const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      if (!['09:00', '10:30', '14:00'].includes(hora)) horas.push(hora)
    }
  }
  return horas
}

function diasDisponibles() {
  const dias = []
  const hoy = new Date()
  for (let i = 1; i <= 10; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dias.push({
        fecha: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })
      })
    }
  }
  return dias
}

export default function PortalInicio() {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [seccion, setSeccion] = useState<string | null>(null)
  const [paso, setPaso] = useState(1)
  const [especialidad, setEspecialidad] = useState('')
  const [fechaSel, setFechaSel] = useState('')
  const [horaSel, setHoraSel] = useState('')
  const [confirmada, setConfirmada] = useState(false)
  const [loadingCita, setLoadingCita] = useState(false)
  const [hcs, setHcs] = useState<{id:string;fecha:string;medico:string;motivo:string;diagnosticos:string;firmada:boolean}[]>([])
  const [loadingHC, setLoadingHC] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('portal_paciente')
    if (!data) { window.location.href = '/portal'; return }
    setPaciente(JSON.parse(data))
  }, [])

  useEffect(() => {
    if (seccion === 'historia' && paciente) cargarHCs()
  }, [seccion, paciente])

  async function cargarHCs() {
    if (!paciente) return
    setLoadingHC(true)
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await sb.from('historias_clinicas').select('id,fecha,medico,motivo,diagnosticos,firmada').eq('paciente_id', paciente.id).order('fecha', { ascending: false })
    setHcs(data || [])
    setLoadingHC(false)
  }

  const salir = () => { localStorage.removeItem('portal_paciente'); window.location.href = '/portal' }
  const volver = () => { setSeccion(null); setPaso(1); setEspecialidad(''); setFechaSel(''); setHoraSel(''); setConfirmada(false) }

  if (!paciente) return null

  const s = { fontFamily: 'Inter,system-ui,sans-serif' }

  const Hdr = ({ titulo, icono }: { titulo: string; icono: string }) => (
    <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
      <button onClick={volver} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
        ← Volver
      </button>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{titulo}</div>
    </div>
  )

  // ── INFORMACIÓN ──
  if (seccion === 'info') return (
    <div style={{ ...s, minHeight: '100vh', background: '#F8FAFC', maxWidth: '520px', margin: '0 auto' }}>
      <Hdr titulo="Mi Información" icono="👤" />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 14px' }}>👤</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>{paciente.nombre} {paciente.apellido}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', marginBottom: '12px' }}>CC {paciente.documento}</div>
          <span style={{ fontSize: '11px', fontWeight: '600', padding: '5px 14px', borderRadius: '20px', background: paciente.activo ? '#ECFDF5' : '#FEF2F2', color: paciente.activo ? '#059669' : '#DC2626', border: `1px solid ${paciente.activo ? '#A7F3D0' : '#FECACA'}` }}>
            {paciente.activo ? '● Afiliación activa' : '● Afiliación inactiva'}
          </span>
        </div>
        {[['EPS / Aseguradora', paciente.eps || 'No registrada'], ['Teléfono', paciente.telefono || 'No registrado'], ['Tipo de afiliación', 'Cotizante'], ['Régimen', 'Contributivo']].map(([l, v]) => (
          <div key={l} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>{l}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )

  // ── CITAS ──
  if (seccion === 'citas') return (
    <div style={{ ...s, minHeight: '100vh', background: '#F8FAFC', maxWidth: '520px', margin: '0 auto' }}>
      <Hdr titulo="Citas Médicas" icono="📅" />
      <div style={{ padding: '20px' }}>
        {confirmada ? (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px 24px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>✓</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>Cita confirmada</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.8', marginBottom: '24px' }}>
              {especialidad}<br />
              <strong style={{ color: '#0F172A' }}>{new Date(fechaSel + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })}</strong><br />
              {horaSel} · MediCore IPS
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#059669', marginBottom: '20px' }}>
              Recibirás un recordatorio 24h antes
            </div>
            <button onClick={() => { setConfirmada(false); setPaso(1); setEspecialidad(''); setFechaSel(''); setHoraSel('') }}
              style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
              Solicitar otra cita
            </button>
          </div>
        ) : (
          <>
            {/* Pasos */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '4px' }}>
              {['Especialidad', 'Fecha', 'Hora', 'Confirmar'].map((label, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: paso > i + 1 ? '#059669' : paso === i + 1 ? '#2563EB' : '#E2E8F0', color: paso >= i + 1 ? '#fff' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
                      {paso > i + 1 ? '✓' : i + 1}
                    </div>
                    <div style={{ fontSize: '9px', color: paso === i + 1 ? '#2563EB' : '#94A3B8', fontWeight: paso === i + 1 ? '700' : '400', whiteSpace: 'nowrap' }}>{label}</div>
                  </div>
                  {i < 3 && <div style={{ height: '1px', background: paso > i + 1 ? '#059669' : '#E2E8F0', flex: 0.5, marginBottom: '18px' }} />}
                </div>
              ))}
            </div>

            {paso === 1 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '14px' }}>Selecciona la especialidad</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ESPECIALIDADES.map(esp => (
                    <button key={esp} onClick={() => { setEspecialidad(esp); setPaso(2) }}
                      style={{ padding: '13px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '500', color: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#EFF6FF' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC' }}>
                      {esp} <span style={{ color: '#CBD5E1', fontSize: '16px' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paso === 2 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{especialidad}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '14px' }}>Selecciona la fecha</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {diasDisponibles().map(dia => (
                    <button key={dia.fecha} onClick={() => { setFechaSel(dia.fecha); setPaso(3) }}
                      style={{ padding: '13px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textTransform: 'capitalize' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#EFF6FF' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC' }}>
                      {dia.label} <span style={{ color: '#CBD5E1', fontSize: '16px' }}>›</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setPaso(1)} style={{ marginTop: '12px', width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#64748B' }}>← Cambiar especialidad</button>
              </div>
            )}

            {paso === 3 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{especialidad}</div>
                <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', textTransform: 'capitalize' }}>
                  {new Date(fechaSel + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '12px' }}>Horas disponibles</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                  {generarHoras().map(hora => (
                    <button key={hora} onClick={() => { setHoraSel(hora); setPaso(4) }}
                      style={{ padding: '11px 6px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', fontWeight: '600', color: '#0F172A' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A' }}>
                      {hora}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPaso(2)} style={{ marginTop: '12px', width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#64748B' }}>← Cambiar fecha</button>
              </div>
            )}

            {paso === 4 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '16px' }}>Resumen de tu cita</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[
                    ['Paciente', `${paciente.nombre} ${paciente.apellido}`],
                    ['Especialidad', especialidad],
                    ['Fecha', new Date(fechaSel + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })],
                    ['Hora', horaSel],
                    ['IPS', 'MediCore IPS'],
                    ['EPS', paciente.eps || 'No registrada'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 14px', background: '#F8FAFC', borderRadius: '8px', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', textAlign: 'right', textTransform: 'capitalize' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#FFFBEB', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#92400E', marginBottom: '16px' }}>
                  Llega 15 minutos antes con tu documento de identidad
                </div>
                <button onClick={async () => { setLoadingCita(true); await new Promise(r => setTimeout(r, 1200)); setConfirmada(true); setLoadingCita(false) }} disabled={loadingCita}
                  style={{ width: '100%', padding: '14px', background: loadingCita ? '#94A3B8' : '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: loadingCita ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: '10px' }}>
                  {loadingCita ? 'Confirmando...' : 'Confirmar cita'}
                </button>
                <button onClick={() => setPaso(3)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#64748B' }}>← Cambiar hora</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  // ── HISTORIA ──
  if (seccion === 'historia') return (
    <div style={{ ...s, minHeight: '100vh', background: '#F8FAFC', maxWidth: '520px', margin: '0 auto' }}>
      <Hdr titulo="Mi Historia Clínica" icono="📋" />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loadingHC ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8', fontSize: '13px' }}>Cargando...</div>
        ) : hcs.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.5 }}>📋</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>Sin consultas registradas</div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Tus consultas aparecerán aquí</div>
          </div>
        ) : hcs.map(hc => {
          let dx = ''
          try { dx = JSON.parse(hc.diagnosticos)?.[0]?.descripcion || '' } catch {}
          return (
            <div key={hc.id} style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid #F1F5F9', borderLeft: '3px solid #2563EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
                  {new Date(hc.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: hc.firmada ? '#ECFDF5' : '#FEF2F2', color: hc.firmada ? '#059669' : '#DC2626' }}>
                  {hc.firmada ? 'Firmada' : 'Sin firma'}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>{hc.motivo || 'Consulta médica'}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: dx ? '8px' : '0' }}>{hc.medico}</div>
              {dx && <div style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', background: '#F5F3FF', color: '#7C3AED', display: 'inline-block' }}>{dx}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── OTRAS SECCIONES ──
  if (seccion) return (
    <div style={{ ...s, minHeight: '100vh', background: '#F8FAFC', maxWidth: '520px', margin: '0 auto' }}>
      <Hdr titulo={MENU.find(m => m.id === seccion)?.label || ''} icono="" />
      <div style={{ padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px', opacity: 0.4 }}>{MENU.find(m => m.id === seccion)?.icon}</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '6px' }}>{MENU.find(m => m.id === seccion)?.label}</div>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>Disponible próximamente</div>
        </div>
      </div>
    </div>
  )

  // ── HOME ──
  return (
    <div style={{ ...s, minHeight: '100vh', background: '#F8FAFC', maxWidth: '520px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏥</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>MediCore IPS</div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Portal del Paciente</div>
          </div>
        </div>
        <button onClick={salir} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px 14px', color: '#64748B', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Salir</button>
      </div>

      {/* Bienvenida */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Bienvenido/a</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '2px' }}>{paciente.nombre} {paciente.apellido}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>CC {paciente.documento} · {paciente.eps || 'Sin EPS'}</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', background: paciente.activo ? '#ECFDF5' : '#FEF2F2', color: paciente.activo ? '#059669' : '#DC2626', border: `1px solid ${paciente.activo ? '#A7F3D0' : '#FECACA'}`, flexShrink: 0 }}>
            {paciente.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Cita rápida */}
        <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '16px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #DBEAFE' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600', marginBottom: '2px' }}>Sin citas programadas</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Solicita tu próxima cita</div>
          </div>
          <button onClick={() => setSeccion('citas')}
            style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Agendar →
          </button>
        </div>

        {/* Servicios */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Servicios</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {MENU.map(item => (
              <button key={item.id} onClick={() => setSeccion(item.id)}
                style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: '14px', padding: '18px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = '#F8FAFC' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.background = '#fff' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', lineHeight: '1.3' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#CBD5E1', lineHeight: '1.8' }}>
        Ley 1581/2012 · Res. 3100/2019 · ISO 27001
      </div>
    </div>
  )
}
