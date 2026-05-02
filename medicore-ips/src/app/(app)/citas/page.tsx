'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Medico {
  id: string
  nombre: string
  apellido: string
  especialidad: string
  color: string
  activo: boolean
}

interface Turno {
  id: string
  medico_id: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  duracion_cita: number
}

interface Cita {
  id: string
  paciente_nombre: string
  medico: string
  medico_id?: string
  especialidad: string
  fecha_hora: string
  estado: string
  estado_llegada: string
  motivo?: string
  eps?: string
}

const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const ESTADO_LLEGADA = [
  { value: 'pendiente', label: 'Pendiente', bg: '#F5F7FA', text: '#9CA3AF' },
  { value: 'en_espera', label: 'En espera', bg: '#FFFBEB', text: '#D97706' },
  { value: 'en_consulta', label: 'En consulta', bg: '#EFF6FF', text: '#1D4ED8' },
  { value: 'atendido', label: 'Atendido', bg: '#F0FDF4', text: '#16A34A' },
  { value: 'no_asistio', label: 'No asistió', bg: '#FEF2F2', text: '#DC2626' },
]

function getFechasSemana(offset = 0): Date[] {
  const hoy = new Date()
  const lunes = new Date(hoy)
  const dia = hoy.getDay() || 7
  lunes.setDate(hoy.getDate() - dia + 1 + offset * 7)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(lunes.getDate() + i)
    return d
  })
}

function generarHoras(inicio: string, fin: string, duracion: number): string[] {
  const horas: string[] = []
  const [hI, mI] = inicio.split(':').map(Number)
  const [hF, mF] = fin.split(':').map(Number)
  let minutos = hI * 60 + mI
  const finMin = hF * 60 + mF
  while (minutos < finMin) {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0')
    const m = (minutos % 60).toString().padStart(2, '0')
    horas.push(`${h}:${m}`)
    minutos += duracion
  }
  return horas
}

export default function CitasPage() {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [cargando, setCargando] = useState(true)
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<Medico | null>(null)
  const [semanaOffset, setSemanaOffset] = useState(0)
  const [vista, setVista] = useState<'agenda' | 'nueva' | 'llegadas'>('agenda')
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [modalCita, setModalCita] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    paciente_nombre: '', especialidad: '', eps: '',
    motivo: '', canal_recordatorio: 'WhatsApp'
  })

  const fechasSemana = getFechasSemana(semanaOffset)

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    if (medicoSeleccionado) cargarCitas()
  }, [medicoSeleccionado, semanaOffset])

  async function cargarDatos() {
    setCargando(true)
    const [{ data: meds }, { data: tur }] = await Promise.all([
      supabase.from('medicos').select('*').eq('activo', true).order('apellido'),
      supabase.from('turnos').select('*').eq('activo', true)
    ])
    setMedicos(meds || [])
    setTurnos(tur || [])
    if (meds && meds.length > 0) setMedicoSeleccionado(meds[0])
    setCargando(false)
  }

  async function cargarCitas() {
    if (!medicoSeleccionado) return
    const inicio = fechasSemana[0].toISOString().split('T')[0]
    const fin = fechasSemana[4].toISOString().split('T')[0]
    const { data } = await supabase
      .from('citas')
      .select('*')
      .eq('medico_id', medicoSeleccionado.id)
      .gte('fecha_hora', inicio)
      .lte('fecha_hora', fin + 'T23:59:59')
      .order('fecha_hora')
    setCitas(data || [])
  }

  async function guardarCita() {
    if (!medicoSeleccionado || !diaSeleccionado || !horaSeleccionada) return
    if (!form.paciente_nombre) { toast.error('Ingresa el nombre del paciente'); return }
    setGuardando(true)
    const fechaHora = new Date(diaSeleccionado)
    const [h, m] = horaSeleccionada.split(':').map(Number)
    fechaHora.setHours(h, m, 0, 0)
    const { error } = await supabase.from('citas').insert([{
      paciente_nombre: form.paciente_nombre,
      medico: `Dr. ${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}`,
      medico_id: medicoSeleccionado.id,
      especialidad: form.especialidad || medicoSeleccionado.especialidad,
      fecha_hora: fechaHora.toISOString(),
      estado: 'pendiente',
      estado_llegada: 'pendiente',
      motivo: form.motivo,
      eps: form.eps,
      canal_recordatorio: form.canal_recordatorio
    }])
    if (error) {
      toast.error('Error al guardar: ' + error.message)
    } else {
      toast.success('Cita agendada correctamente')
      setModalCita(false)
      setForm({ paciente_nombre: '', especialidad: '', eps: '', motivo: '', canal_recordatorio: 'WhatsApp' })
      cargarCitas()
    }
    setGuardando(false)
  }

  async function actualizarEstadoLlegada(citaId: string, nuevoEstado: string) {
    const { error } = await supabase
      .from('citas')
      .update({ estado_llegada: nuevoEstado })
      .eq('id', citaId)
    if (!error) {
      toast.success(`Estado actualizado: ${nuevoEstado}`)
      cargarCitas()
    }
  }

  async function confirmarCitaFacturada(citaId: string) {
    const { error } = await supabase
      .from('citas')
      .update({ estado: 'confirmada', estado_llegada: 'atendido' })
      .eq('id', citaId)
    if (!error) {
      toast.success('✅ Cita confirmada — aparecerá en agenda del médico')
      cargarCitas()
    }
  }

  function getCitasHoraFecha(fecha: Date, hora: string): Cita[] {
    return citas.filter(c => {
      const fc = new Date(c.fecha_hora)
      const fechaStr = fecha.toISOString().split('T')[0]
      const fcStr = fc.toISOString().split('T')[0]
      const horaC = `${fc.getHours().toString().padStart(2, '0')}:${fc.getMinutes().toString().padStart(2, '0')}`
      return fechaStr === fcStr && horaC === hora
    })
  }

  function getTurnosDia(diaSemana: number): Turno[] {
    if (!medicoSeleccionado) return []
    return turnos.filter(t => t.medico_id === medicoSeleccionado.id && t.dia_semana === diaSemana)
  }

  function getHorasDisponiblesDia(fecha: Date): string[] {
    const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay()
    const turnosDia = getTurnosDia(diaSemana)
    if (turnosDia.length === 0) return []
    const todasHoras: string[] = []
    turnosDia.forEach(t => {
      const horas = generarHoras(t.hora_inicio.slice(0, 5), t.hora_fin.slice(0, 5), t.duracion_cita)
      todasHoras.push(...horas)
    })
    const citasDia = citas.filter(c => {
      const fc = new Date(c.fecha_hora)
      return fc.toISOString().split('T')[0] === fecha.toISOString().split('T')[0]
    })
    const horasOcupadas = citasDia.map(c => {
      const fc = new Date(c.fecha_hora)
      return `${fc.getHours().toString().padStart(2, '0')}:${fc.getMinutes().toString().padStart(2, '0')}`
    })
    return todasHoras.filter(h => !horasOcupadas.includes(h))
  }

  const citasHoy = citas.filter(c => {
    const hoy = new Date().toISOString().split('T')[0]
    return new Date(c.fecha_hora).toISOString().split('T')[0] === hoy
  })

  const tabStyle = (tab: string) => ({
    padding: '9px 18px', fontSize: '13px',
    fontWeight: vista === tab ? '700' : '500',
    color: vista === tab ? '#C74634' : '#5F6B7A',
    background: 'none', border: 'none',
    borderBottom: `2px solid ${vista === tab ? '#C74634' : 'transparent'}`,
    cursor: 'pointer', fontFamily: 'inherit',
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📅 Agendamiento de Citas</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Res. 1552/2013 · Gestión de agenda médica · {citas.length} citas esta semana</p>
        </div>
      </div>

      {/* Selector de médico */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          👨‍⚕️ Selecciona el médico para ver su agenda
        </div>
        {cargando ? (
          <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Cargando médicos...</div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {medicos.map(med => (
              <button key={med.id}
                onClick={() => setMedicoSeleccionado(med)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                  border: `2px solid ${medicoSeleccionado?.id === med.id ? med.color : '#E8ECF0'}`,
                  background: medicoSeleccionado?.id === med.id ? med.color + '15' : '#F5F7FA',
                  color: medicoSeleccionado?.id === med.id ? med.color : '#5F6B7A',
                  fontWeight: medicoSeleccionado?.id === med.id ? '700' : '500',
                  fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: med.color, flexShrink: 0 }} />
                Dr. {med.nombre} {med.apellido}
                <span style={{ fontSize: '10px', opacity: 0.7 }}>· {med.especialidad}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {medicoSeleccionado && (
        <>
          {/* Info médico seleccionado */}
          <div style={{ background: `${medicoSeleccionado.color}10`, border: `1px solid ${medicoSeleccionado.color}30`, borderLeft: `4px solid ${medicoSeleccionado.color}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: medicoSeleccionado.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍⚕️</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>Dr. {medicoSeleccionado.nombre} {medicoSeleccionado.apellido}</div>
                <div style={{ fontSize: '12px', color: '#5F6B7A' }}>{medicoSeleccionado.especialidad} · {citasHoy.length} citas hoy</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: '#5F6B7A', fontFamily: 'monospace', background: '#F5F7FA', padding: '4px 10px', borderRadius: '6px' }}>
                {turnos.filter(t => t.medico_id === medicoSeleccionado.id).length > 0
                  ? `Turnos: ${[...new Set(turnos.filter(t => t.medico_id === medicoSeleccionado.id).map(t => t.hora_inicio.slice(0,5) + '-' + t.hora_fin.slice(0,5)))].join(', ')}`
                  : 'Sin turnos asignados'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '2px solid #E8ECF0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              <button style={tabStyle('agenda')} onClick={() => setVista('agenda')}>📅 Agenda semanal</button>
              <button style={tabStyle('llegadas')} onClick={() => setVista('llegadas')}>
                🚶 Control de llegadas
                {citasHoy.length > 0 && <span style={{ marginLeft: '6px', background: '#C74634', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '10px' }}>{citasHoy.length}</span>}
              </button>
            </div>
          </div>

          {/* VISTA AGENDA SEMANAL */}
          {vista === 'agenda' && (
            <div>
              {/* Navegación semana */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button onClick={() => setSemanaOffset(s => s - 1)}
                  style={{ padding: '7px 14px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#5F6B7A' }}>
                  ← Semana anterior
                </button>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>
                  {fechasSemana[0].toLocaleDateString('es-CO', { day: '2-digit', month: 'long' })} — {fechasSemana[4].toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setSemanaOffset(0)}
                    style={{ padding: '7px 14px', background: '#FFF5F3', border: '1px solid #ffd5cc', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#C74634', fontWeight: '700' }}>
                    Hoy
                  </button>
                  <button onClick={() => setSemanaOffset(s => s + 1)}
                    style={{ padding: '7px 14px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#5F6B7A' }}>
                    Semana siguiente →
                  </button>
                </div>
              </div>

              {/* Grid de agenda */}
              <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {/* Headers días */}
                <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', borderBottom: '2px solid #E8ECF0' }}>
                  <div style={{ padding: '12px', background: '#F5F7FA' }} />
                  {fechasSemana.map((fecha, i) => {
                    const esHoy = fecha.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                    const turnosDia = getTurnosDia(fecha.getDay() === 0 ? 7 : fecha.getDay())
                    return (
                      <div key={i} style={{ padding: '12px 8px', background: esHoy ? '#FFF5F3' : '#F5F7FA', borderLeft: '1px solid #E8ECF0', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: esHoy ? '#C74634' : '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{DIAS[i + 1]}</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: esHoy ? '#fff' : '#1A1A2E', width: '32px', height: '32px', borderRadius: '50%', background: esHoy ? '#C74634' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto' }}>
                          {fecha.getDate()}
                        </div>
                        <div style={{ fontSize: '9px', color: turnosDia.length > 0 ? '#16A34A' : '#9CA3AF', fontFamily: 'monospace', fontWeight: '600' }}>
                          {turnosDia.length > 0 ? `${turnosDia.length} turno${turnosDia.length > 1 ? 's' : ''}` : 'Sin turno'}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Filas de horas */}
                {['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'].map(hora => (
                  <div key={hora} style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', borderBottom: '1px solid #F5F7FA', minHeight: '48px' }}>
                    <div style={{ padding: '10px 8px', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', fontWeight: '600', textAlign: 'right', background: '#FAFAFA', borderRight: '1px solid #E8ECF0' }}>
                      {hora}
                    </div>
                    {fechasSemana.map((fecha, i) => {
                      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay()
                      const turnosDia = getTurnosDia(diaSemana)
                      const [hH, mH] = hora.split(':').map(Number)
                      const minH = hH * 60 + mH
                      const enTurno = turnosDia.some(t => {
                        const [hI, mI] = t.hora_inicio.slice(0,5).split(':').map(Number)
                        const [hF, mF] = t.hora_fin.slice(0,5).split(':').map(Number)
                        return minH >= hI * 60 + mI && minH < hF * 60 + mF
                      })
                      const citasHoraFecha = getCitasHoraFecha(fecha, hora)
                      const esHoy = fecha.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]

                      return (
                        <div key={i}
                          onClick={() => {
                            if (!enTurno || citasHoraFecha.length > 0) return
                            setDiaSeleccionado(fecha)
                            setHoraSeleccionada(hora)
                            setModalCita(true)
                          }}
                          style={{
                            padding: '4px', borderLeft: '1px solid #E8ECF0',
                            background: esHoy && enTurno ? '#FFFBF5' : enTurno ? '#FAFFFE' : '#F9FAFB',
                            cursor: enTurno && citasHoraFecha.length === 0 ? 'pointer' : 'default',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { if (enTurno && citasHoraFecha.length === 0) e.currentTarget.style.background = '#FFF5F3' }}
                          onMouseLeave={e => { e.currentTarget.style.background = esHoy && enTurno ? '#FFFBF5' : enTurno ? '#FAFFFE' : '#F9FAFB' }}>
                          {citasHoraFecha.map(cita => {
                            const el = ESTADO_LLEGADA.find(e => e.value === cita.estado_llegada)
                            return (
                              <div key={cita.id}
                                style={{ background: medicoSeleccionado.color, borderRadius: '6px', padding: '4px 8px', margin: '2px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cita.paciente_nombre}</div>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: el?.text || '#fff', display: 'inline-block' }} />
                                  {el?.label}
                                </div>
                              </div>
                            )
                          })}
                          {enTurno && citasHoraFecha.length === 0 && (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0' }}>
                              <span style={{ fontSize: '9px', color: '#C74634', fontWeight: '700' }}>+ Nueva cita</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA CONTROL DE LLEGADAS */}
          {vista === 'llegadas' && (
            <div>
              <div style={{ background: '#EFF6FF', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#1D4ED8' }}>
                📋 Control de llegadas para hoy — Dr. {medicoSeleccionado.nombre} {medicoSeleccionado.apellido}
                <strong style={{ marginLeft: '8px' }}>{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })}</strong>
              </div>

              {citasHoy.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '12px', padding: '48px', textAlign: 'center', border: '1px solid #E8ECF0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>Sin citas para hoy</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>No hay pacientes agendados para este médico hoy</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {citasHoy
                    .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
                    .map(cita => {
                      const hora = new Date(cita.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                      const el = ESTADO_LLEGADA.find(e => e.value === cita.estado_llegada)
                      return (
                        <div key={cita.id} style={{ background: '#fff', border: '1px solid #E8ECF0', borderLeft: `4px solid ${medicoSeleccionado.color}`, borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                              {/* Hora */}
                              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                                <div style={{ background: medicoSeleccionado.color + '15', border: `1px solid ${medicoSeleccionado.color}30`, borderRadius: '8px', padding: '6px 10px' }}>
                                  <div style={{ fontSize: '18px', fontWeight: '800', color: medicoSeleccionado.color, fontFamily: 'monospace' }}>{hora}</div>
                                </div>
                              </div>
                              {/* Info */}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>{cita.paciente_nombre}</div>
                                <div style={{ fontSize: '12px', color: '#5F6B7A', marginBottom: '4px' }}>{cita.especialidad} · {cita.eps || 'Sin EPS'}</div>
                                {cita.motivo && <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Motivo: {cita.motivo}</div>}
                              </div>
                            </div>
                            {/* Estado y acciones */}
                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: el?.bg, color: el?.text, whiteSpace: 'nowrap' }}>
                                {el?.label}
                              </span>
                              {/* Botones de estado */}
                              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                {ESTADO_LLEGADA.filter(e => e.value !== cita.estado_llegada && e.value !== 'pendiente').map(e => (
                                  <button key={e.value}
                                    onClick={() => actualizarEstadoLlegada(cita.id, e.value)}
                                    style={{ padding: '4px 8px', background: e.bg, border: `1px solid ${e.text}30`, borderRadius: '5px', fontSize: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', color: e.text, whiteSpace: 'nowrap' }}>
                                    {e.label}
                                  </button>
                                ))}
                              </div>
                              {/* Botón confirmar facturación */}
                              {cita.estado !== 'confirmada' && cita.estado_llegada === 'atendido' && (
                                <button
                                  onClick={() => confirmarCitaFacturada(cita.id)}
                                  style={{ padding: '6px 12px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                                  💳 Confirmar para facturación
                                </button>
                              )}
                              {cita.estado === 'confirmada' && (
                                <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#F0FDF4', color: '#16A34A' }}>
                                  ✅ Confirmada — lista para facturar
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal nueva cita */}
      {modalCita && medicoSeleccionado && diaSeleccionado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModalCita(false) }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E8ECF0', background: medicoSeleccionado.color + '10', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E' }}>Nueva Cita</div>
                <div style={{ fontSize: '12px', color: '#5F6B7A', fontFamily: 'monospace' }}>
                  Dr. {medicoSeleccionado.nombre} {medicoSeleccionado.apellido} · {diaSeleccionado.toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })} · {horaSeleccionada}
                </div>
              </div>
              <button onClick={() => setModalCita(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
            </div>

            {/* Horas disponibles */}
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #E8ECF0' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                Horas disponibles ese día
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {getHorasDisponiblesDia(diaSeleccionado).map(h => (
                  <button key={h} onClick={() => setHoraSeleccionada(h)}
                    style={{ padding: '5px 10px', borderRadius: '6px', border: `1.5px solid ${horaSeleccionada === h ? medicoSeleccionado.color : '#E8ECF0'}`, background: horaSeleccionada === h ? medicoSeleccionado.color + '15' : '#F5F7FA', color: horaSeleccionada === h ? medicoSeleccionado.color : '#5F6B7A', fontFamily: 'monospace', fontSize: '12px', fontWeight: horaSeleccionada === h ? '700' : '500', cursor: 'pointer' }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { field: 'paciente_nombre', label: 'Nombre del paciente', placeholder: 'Nombre completo' },
                { field: 'eps', label: 'EPS / Aseguradora', placeholder: 'Nueva EPS, Sanitas...' },
                { field: 'motivo', label: 'Motivo de consulta', placeholder: 'Descripción del motivo' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder}
                    value={form[f.field as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA' }}
                    onFocus={e => e.target.style.borderColor = '#C74634'}
                    onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>Canal recordatorio</label>
                <select value={form.canal_recordatorio} onChange={e => setForm({ ...form, canal_recordatorio: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA' }}>
                  {['WhatsApp', 'Email', 'SMS', 'Sin recordatorio'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button onClick={() => setModalCita(false)}
                  style={{ padding: '9px 18px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}>
                  Cancelar
                </button>
                <button onClick={guardarCita} disabled={guardando}
                  style={{ padding: '9px 18px', background: guardando ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {guardando ? 'Guardando...' : '📅 Confirmar cita'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
