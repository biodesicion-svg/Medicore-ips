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
  { id: 'info', icon: '👤', label: 'Mi información', color: '#1D4ED8', bg: '#EFF6FF' },
  { id: 'citas', icon: '📅', label: 'Citas médicas', color: '#16A34A', bg: '#F0FDF4' },
  { id: 'historia', icon: '📋', label: 'Historia clínica', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'incapacidades', icon: '🩹', label: 'Incapacidades', color: '#D97706', bg: '#FFFBEB' },
  { id: 'resultados', icon: '🧪', label: 'Resultados', color: '#0D9488', bg: '#F0FDFA' },
  { id: 'pagos', icon: '💳', label: 'Histórico pagos', color: '#DC2626', bg: '#FEF2F2' },
]

const ESPECIALIDADES = [
  'MEDICINA GENERAL', 'CARDIOLOGÍA', 'PEDIATRÍA', 'GINECOLOGÍA',
  'ORTOPEDIA', 'NEUROLOGÍA', 'DERMATOLOGÍA', 'ODONTOLOGÍA',
  'NUTRICIÓN Y DIETÉTICA', 'PSICOLOGÍA', 'OFTALMOLOGÍA', 'UROLOGÍA'
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
  for (let i = 1; i <= 14; i++) {
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

  const confirmarCita = async () => {
    setLoadingCita(true)
    await new Promise(r => setTimeout(r, 1200))
    setConfirmada(true)
    setLoadingCita(false)
  }

  if (!paciente) return null

  const hdr = (titulo: string, icono: string) => (
    <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <button onClick={() => { setSeccion(null); setPaso(1); setEspecialidad(''); setFechaSel(''); setHoraSel(''); setConfirmada(false) }}
        style={{ background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: '#5F6B7A' }}>
        ← Volver
      </button>
      <span style={{ fontSize: '18px' }}>{icono}</span>
      <div style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>{titulo}</div>
    </div>
  )

  if (seccion === 'info') return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', maxWidth: '520px', margin: '0 auto', fontFamily: 'Inter,system-ui,sans-serif' }}>
      {hdr('Mi Información', '👤')}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FFF5F3', border: '2px solid #ffd5cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 14px' }}>👤</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>{paciente.nombre} {paciente.apellido}</div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'monospace', marginBottom: '10px' }}>CC {paciente.documento}</div>
          <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: paciente.activo ? '#F0FDF4' : '#FEF2F2', color: paciente.activo ? '#16A34A' : '#DC2626' }}>
            {paciente.activo ? '● AFILIACIÓN ACTIVA' : '● AFILIACIÓN INACTIVA'}
          </span>
        </div>
        {[['🏥 EPS', paciente.eps || 'No registrada'], ['📱 Teléfono', paciente.telefono || 'No registrado'], ['🪪 Tipo afiliación', 'Cotizante'], ['📋 Régimen', 'Contributivo']].map(([l, v]) => (
          <div key={l as string} style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#5F6B7A' }}>{l as string}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>{v as string}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (seccion === 'citas') return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', maxWidth: '520px', margin: '0 auto', fontFamily: 'Inter,system-ui,sans-serif' }}>
      {hdr('Citas Médicas', '📅')}
      <div style={{ padding: '20px' }}>
        {confirmada ? (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#16A34A', marginBottom: '8px' }}>¡Cita confirmada!</div>
            <div style={{ fontSize: '13px', color: '#5F6B7A', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong>{especialidad}</strong><br />
              {new Date(fechaSel + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}<br />
              <strong>{horaSel}</strong> · IPS MediCore
            </div>
            <div style={{ background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#166534', marginBottom: '20px' }}>
              📱 Recibirás un recordatorio 24h antes
            </div>
            <button onClick={() => { setConfirmada(false); setPaso(1); setEspecialidad(''); setFechaSel(''); setHoraSel('') }}
              style={{ background: '#C74634', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
              Solicitar otra cita
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['Especialidad', 'Fecha', 'Hora', 'Confirmar'].map((label, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: paso > i + 1 ? '#16A34A' : paso === i + 1 ? '#C74634' : '#E8ECF0', color: paso >= i + 1 ? '#fff' : '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '12px', fontWeight: '700' }}>
                    {paso > i + 1 ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: '9px', color: paso === i + 1 ? '#C74634' : '#9CA3AF', fontWeight: paso === i + 1 ? '700' : '400' }}>{label}</div>
                </div>
              ))}
            </div>

            {paso === 1 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>Selecciona la especialidad</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ESPECIALIDADES.map(esp => (
                    <button key={esp} onClick={() => { setEspecialidad(esp); setPaso(2) }}
                      style={{ padding: '14px 16px', background: '#F5F7FA', border: '1.5px solid #E8ECF0', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '500', color: '#1A1A2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {esp} <span style={{ color: '#9CA3AF' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paso === 2 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#C74634', fontWeight: '700', marginBottom: '4px' }}>{especialidad}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>Selecciona la fecha</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {diasDisponibles().map(dia => (
                    <button key={dia.fecha} onClick={() => { setFechaSel(dia.fecha); setPaso(3) }}
                      style={{ padding: '14px 16px', background: '#F5F7FA', border: '1.5px solid #E8ECF0', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#1A1A2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textTransform: 'capitalize' }}>
                      {dia.label} <span style={{ color: '#9CA3AF' }}>›</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setPaso(1)} style={{ marginTop: '12px', width: '100%', padding: '10px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#5F6B7A' }}>← Cambiar especialidad</button>
              </div>
            )}

            {paso === 3 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#C74634', fontWeight: '700', marginBottom: '4px' }}>{especialidad}</div>
                <div style={{ fontSize: '13px', color: '#5F6B7A', marginBottom: '14px', textTransform: 'capitalize' }}>
                  {new Date(fechaSel + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>Horas disponibles</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {generarHoras().map(hora => (
                    <button key={hora} onClick={() => { setHoraSel(hora); setPaso(4) }}
                      style={{ padding: '12px 8px', background: '#F5F7FA', border: '1.5px solid #E8ECF0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>
                      {hora}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPaso(2)} style={{ marginTop: '12px', width: '100%', padding: '10px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#5F6B7A' }}>← Cambiar fecha</button>
              </div>
            )}

            {paso === 4 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '20px' }}>Confirma tu cita</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {[
                    ['👤 Paciente', `${paciente.nombre} ${paciente.apellido}`],
                    ['🩺 Especialidad', especialidad],
                    ['📅 Fecha', new Date(fechaSel + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })],
                    ['🕐 Hora', horaSel],
                    ['🏥 IPS', 'MediCore IPS'],
                    ['🏥 EPS', paciente.eps || 'No registrada'],
                  ].map(([l, v]) => (
                    <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 14px', background: '#F5F7FA', borderRadius: '8px', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#5F6B7A', flexShrink: 0 }}>{l as string}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', textAlign: 'right', textTransform: 'capitalize' }}>{v as string}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#FFFBEB', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#92400E', marginBottom: '16px' }}>
                  ⚠️ Recuerda llegar 15 minutos antes con tu documento
                </div>
                <button onClick={confirmarCita} disabled={loadingCita}
                  style={{ width: '100%', padding: '14px', background: loadingCita ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loadingCita ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: '10px' }}>
                  {loadingCita ? '⏳ Confirmando...' : '✅ Confirmar cita'}
                </button>
                <button onClick={() => setPaso(3)} style={{ width: '100%', padding: '10px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#5F6B7A' }}>← Cambiar hora</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  if (seccion === 'historia') return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', maxWidth: '520px', margin: '0 auto', fontFamily: 'Inter,system-ui,sans-serif' }}>
      {hdr('Mi Historia Clínica', '📋')}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loadingHC ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Cargando...</div>
        ) : hcs.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E' }}>Sin consultas registradas</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Tus consultas aparecerán aquí</div>
          </div>
        ) : hcs.map(hc => {
          let dx = ''
          try { dx = JSON.parse(hc.diagnosticos)?.[0]?.descripcion || '' } catch {}
          return (
            <div key={hc.id} style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #C74634' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#C74634', fontWeight: '700' }}>
                  {new Date(hc.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: hc.firmada ? '#F0FDF4' : '#FEF2F2', color: hc.firmada ? '#16A34A' : '#DC2626' }}>
                  {hc.firmada ? '✓ Firmada' : 'Sin firma'}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{hc.motivo || 'Consulta médica'}</div>
              <div style={{ fontSize: '12px', color: '#5F6B7A', marginBottom: '4px' }}>{hc.medico}</div>
              {dx && <div style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#F5F3FF', color: '#7C3AED', display: 'inline-block', marginTop: '4px' }}>{dx}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )

  if (seccion) return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', maxWidth: '520px', margin: '0 auto', fontFamily: 'Inter,system-ui,sans-serif' }}>
      {hdr(MENU.find(m => m.id === seccion)?.label || '', MENU.find(m => m.id === seccion)?.icon || '')}
      <div style={{ padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>{MENU.find(m => m.id === seccion)?.icon}</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '6px' }}>{MENU.find(m => m.id === seccion)?.label}</div>
          <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Módulo disponible próximamente</div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', maxWidth: '520px', margin: '0 auto', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #C74634 0%, #a33828 100%)', padding: '24px 20px 32px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏥</div>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>MediCore IPS</span>
          </div>
          <button onClick={salir} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Salir</button>
        </div>
        <div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Bienvenido/a</div>
          <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>{paciente.nombre} {paciente.apellido}</div>
          <div style={{ fontSize: '13px', opacity: 0.85 }}>CC {paciente.documento}</div>
          {paciente.eps && <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '2px' }}>EPS: {paciente.eps}</div>}
          <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: paciente.activo ? 'rgba(16,185,84,0.25)' : 'rgba(239,68,68,0.25)', borderRadius: '20px', padding: '4px 10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: paciente.activo ? '#4ade80' : '#f87171' }} />
            <span style={{ fontSize: '11px', fontWeight: '700' }}>Afiliación: {paciente.activo ? 'ACTIVA' : 'INACTIVA'}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', marginTop: '-16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Servicios disponibles</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {MENU.map(item => (
              <button key={item.id} onClick={() => setSeccion(item.id)}
                style={{ background: item.bg, border: `1px solid ${item.color}20`, borderRadius: '12px', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: '28px' }}>{item.icon}</div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: item.color, textAlign: 'center', lineHeight: '1.3' }}>{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', borderRadius: '16px', padding: '18px', color: '#fff', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>📅 Próxima cita</div>
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>No tienes citas programadas</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '14px' }}>Solicita una cita médica ahora</div>
          <button onClick={() => setSeccion('citas')}
            style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            Solicitar cita →
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', lineHeight: '1.8' }}>
          🔒 Ley 1581/2012 · Res. 3100/2019<br />Tus datos están protegidos
        </div>
      </div>
    </div>
  )
}
