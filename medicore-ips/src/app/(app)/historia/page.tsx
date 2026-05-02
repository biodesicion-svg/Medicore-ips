'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface HC {
  id: string
  paciente_nombre: string
  medico: string
  fecha: string
  motivo: string
  anamnesis: string
  examen_fisico: string
  diagnosticos: string
  plan_manejo: string
  signos_vitales: string
  firmada: boolean
  created_at: string
}

interface Diagnostico {
  codigo: string
  descripcion: string
  tipo: string
}

function formatearFechaHora(fecha: string): { fecha: string; hora: string } {
  try {
    const d = new Date(fecha)
    return {
      fecha: d.toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      hora: d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    }
  } catch { return { fecha: fecha, hora: '—' } }
}

function primerDiagnostico(diagnosticos: string): string {
  try {
    const arr: Diagnostico[] = JSON.parse(diagnosticos)
    if (arr.length > 0) return `${arr[0].codigo} — ${arr[0].descripcion}`
  } catch {}
  return '—'
}

function getSignos(sv: string) {
  try { return JSON.parse(sv) } catch { return {} }
}

function agruparPorFecha(hcs: HC[]): Record<string, HC[]> {
  const grupos: Record<string, HC[]> = {}
  hcs.forEach(hc => {
    try {
      const fecha = new Date(hc.fecha).toLocaleDateString('es-CO', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
      })
      if (!grupos[fecha]) grupos[fecha] = []
      grupos[fecha].push(hc)
    } catch {
      if (!grupos['Sin fecha']) grupos['Sin fecha'] = []
      grupos['Sin fecha'].push(hc)
    }
  })
  return grupos
}

function colorMedico(medico: string): string {
  const colores = ['#C74634', '#1D4ED8', '#16A34A', '#D97706', '#7C3AED', '#0D9488', '#DC2626', '#2563EB', '#059669', '#9333EA']
  let hash = 0
  for (let i = 0; i < medico.length; i++) hash += medico.charCodeAt(i)
  return colores[hash % colores.length]
}

export default function HistoriaPage() {
  const [hcs, setHcs] = useState<HC[]>([])
  const [filtradas, setFiltradas] = useState<HC[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [tabActiva, setTabActiva] = useState<'timeline' | 'tabla' | 'detalle'>('timeline')
  const [hcSeleccionada, setHcSeleccionada] = useState<HC | null>(null)
  const [stats, setStats] = useState({ total: 0, firmadas: 0, sinFirmar: 0, pacientes: 0, medicos: 0 })

  useEffect(() => { cargarHCs() }, [])

  useEffect(() => {
    const b = busqueda.toLowerCase()
    setFiltradas(hcs.filter(h =>
      (h.paciente_nombre || '').toLowerCase().includes(b) ||
      (h.medico || '').toLowerCase().includes(b) ||
      (h.motivo || '').toLowerCase().includes(b) ||
      primerDiagnostico(h.diagnosticos).toLowerCase().includes(b)
    ))
  }, [busqueda, hcs])

  async function cargarHCs() {
    setCargando(true)
    const { data, error } = await supabase
      .from('historias_clinicas')
      .select('*')
      .order('fecha', { ascending: false })
    if (!error && data) {
      setHcs(data)
      setFiltradas(data)
      const pacientesUnicos = new Set(data.map(h => h.paciente_nombre)).size
      const medicosUnicos = new Set(data.map(h => h.medico)).size
      setStats({
        total: data.length,
        firmadas: data.filter(h => h.firmada).length,
        sinFirmar: data.filter(h => !h.firmada).length,
        pacientes: pacientesUnicos,
        medicos: medicosUnicos
      })
    }
    setCargando(false)
  }

  function verDetalle(hc: HC) {
    setHcSeleccionada(hc)
    setTabActiva('detalle')
  }

  const tabStyle = (tab: string) => ({
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: tabActiva === tab ? '700' : '500',
    color: tabActiva === tab ? '#C74634' : '#5F6B7A',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${tabActiva === tab ? '#C74634' : 'transparent'}`,
    cursor: 'pointer',
    fontFamily: 'inherit',
  })

  const grupos = agruparPorFecha(filtradas)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📋 Historia Clínica Electrónica</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Res. 3100/2019 · Ley 527/1999 · {stats.total} registros</p>
        </div>
        <input placeholder="Buscar por paciente, médico, motivo o diagnóstico..."
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '8px 14px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '320px', background: '#F5F7FA' }}
          onFocus={e => e.target.style.borderColor = '#C74634'}
          onBlur={e => e.target.style.borderColor = '#E8ECF0'}
        />
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total HCs', value: stats.total, color: '#1D4ED8', bg: '#EFF6FF', icon: '📋' },
          { label: 'Firmadas', value: stats.firmadas, color: '#16A34A', bg: '#F0FDF4', icon: '✅' },
          { label: 'Sin firmar', value: stats.sinFirmar, color: '#DC2626', bg: '#FEF2F2', icon: '⚠️' },
          { label: 'Pacientes únicos', value: stats.pacientes, color: '#7C3AED', bg: '#F5F3FF', icon: '👥' },
          { label: 'Médicos', value: stats.medicos, color: '#D97706', bg: '#FFFBEB', icon: '👨‍⚕️' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{k.icon} {k.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: k.color, letterSpacing: '-1px' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #E8ECF0', marginBottom: '20px', display: 'flex' }}>
        <button style={tabStyle('timeline')} onClick={() => setTabActiva('timeline')}>📅 Por fecha y hora</button>
        <button style={tabStyle('tabla')} onClick={() => setTabActiva('tabla')}>📊 Vista tabla</button>
        {hcSeleccionada && <button style={tabStyle('detalle')} onClick={() => setTabActiva('detalle')}>🔍 Detalle</button>}
      </div>

      {cargando && (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF', background: '#fff', borderRadius: '10px', border: '1px solid #E8ECF0' }}>
          Cargando historias clínicas desde Supabase...
        </div>
      )}

      {/* TIMELINE POR FECHA Y HORA */}
      {!cargando && tabActiva === 'timeline' && (
        <div>
          {Object.keys(grupos).length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '10px', border: '1px solid #E8ECF0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>No hay resultados</div>
            </div>
          ) : Object.entries(grupos).map(([fecha, registros]) => (
            <div key={fecha} style={{ marginBottom: '24px' }}>
              {/* Header de fecha */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#C74634', color: '#fff', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                  📅 {fecha}
                </div>
                <div style={{ flex: 1, height: '1px', background: '#E8ECF0' }} />
                <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', flexShrink: 0 }}>
                  {registros.length} atención{registros.length !== 1 ? 'es' : ''}
                </div>
              </div>

              {/* Atenciones del día */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '16px' }}>
                {registros
                  .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                  .map((hc, i) => {
                    const { hora } = formatearFechaHora(hc.fecha)
                    const colorDoc = colorMedico(hc.medico || '')
                    let dxArr: Diagnostico[] = []
                    try { dxArr = JSON.parse(hc.diagnosticos) } catch {}

                    return (
                      <div key={hc.id}
                        onClick={() => verDetalle(hc)}
                        style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${colorDoc}` }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>

                        {/* Hora */}
                        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '64px' }}>
                          <div style={{ background: colorDoc + '15', border: `1px solid ${colorDoc}30`, borderRadius: '8px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: colorDoc, fontFamily: 'monospace', lineHeight: 1 }}>{hora}</div>
                            <div style={{ fontSize: '9px', color: colorDoc, opacity: 0.7, fontFamily: 'monospace' }}>hora</div>
                          </div>
                        </div>

                        {/* Info principal */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1A1A2E', marginBottom: '2px' }}>{hc.paciente_nombre || '—'}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colorDoc, flexShrink: 0 }} />
                                <span style={{ fontSize: '12px', color: '#5F6B7A' }}>{hc.medico || '—'}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: hc.firmada ? '#F0FDF4' : '#FEF2F2', color: hc.firmada ? '#16A34A' : '#DC2626' }}>
                                {hc.firmada ? '✓ Firmada' : '⚠ Sin firma'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {hc.motivo && (
                              <div style={{ fontSize: '12px', color: '#5F6B7A' }}>
                                <span style={{ fontWeight: '600', color: '#1A1A2E' }}>Motivo:</span> {hc.motivo}
                              </div>
                            )}
                            {dxArr.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {dxArr.map((dx, j) => (
                                  <span key={j} style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: '#F5F3FF', color: '#7C3AED' }}>
                                    {dx.codigo} {dx.descripcion}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {hc.plan_manejo && (
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '600px' }}>
                              📋 {hc.plan_manejo}
                            </div>
                          )}
                        </div>

                        {/* Signos vitales mini */}
                        {(() => {
                          const sv = getSignos(hc.signos_vitales)
                          if (!sv.ta) return null
                          return (
                            <div style={{ flexShrink: 0, display: 'flex', gap: '8px' }}>
                              {[['TA', sv.ta], ['FC', sv.fc], ['SpO₂', `${sv.spo2}%`]].map(([l, v]) => (
                                <div key={l as string} style={{ background: '#F5F7FA', borderRadius: '6px', padding: '6px 8px', textAlign: 'center', minWidth: '48px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#1A1A2E', fontFamily: 'monospace' }}>{v as string}</div>
                                  <div style={{ fontSize: '8px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l as string}</div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA TABLA */}
      {!cargando && tabActiva === 'tabla' && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {filtradas.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>No hay resultados</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['Fecha', 'Hora', 'Paciente', 'Atendido por', 'Motivo', 'Diagnóstico', 'Estado', 'Ver'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', borderBottom: '1px solid #E8ECF0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((hc, i) => {
                  const { fecha, hora } = formatearFechaHora(hc.fecha)
                  const colorDoc = colorMedico(hc.medico || '')
                  return (
                    <tr key={hc.id} style={{ borderBottom: '1px solid #E8ECF0', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF5F3'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'}>
                      <td style={{ padding: '10px 14px', fontSize: '11px', color: '#5F6B7A', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{fecha}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: colorDoc, background: colorDoc + '15', padding: '3px 8px', borderRadius: '5px', fontFamily: 'monospace' }}>{hora}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{hc.paciente_nombre || '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colorDoc, flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: '#5F6B7A' }}>{hc.medico || '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5F6B7A', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hc.motivo || '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: '#F5F3FF', color: '#7C3AED' }}>{primerDiagnostico(hc.diagnosticos)}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: hc.firmada ? '#F0FDF4' : '#FEF2F2', color: hc.firmada ? '#16A34A' : '#DC2626' }}>
                          {hc.firmada ? '✓ Firmada' : '⚠ Sin firma'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button onClick={() => verDetalle(hc)}
                          style={{ padding: '4px 12px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C74634'; e.currentTarget.style.color = '#C74634' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8ECF0'; e.currentTarget.style.color = '#5F6B7A' }}>
                          Ver
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* DETALLE HC */}
      {tabActiva === 'detalle' && hcSeleccionada && (() => {
        const sv = getSignos(hcSeleccionada.signos_vitales)
        const { fecha, hora } = formatearFechaHora(hcSeleccionada.fecha)
        const colorDoc = colorMedico(hcSeleccionada.medico || '')
        let dxArr: Diagnostico[] = []
        try { dxArr = JSON.parse(hcSeleccionada.diagnosticos) } catch {}

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#fff', border: `1px solid #E8ECF0`, borderTop: `4px solid ${colorDoc}`, borderRadius: '10px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: colorDoc + '15', border: `2px solid ${colorDoc}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>🧑</div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#1A1A2E', marginBottom: '6px' }}>{hcSeleccionada.paciente_nombre}</div>

                <div style={{ background: '#F5F7FA', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: colorDoc, fontFamily: 'monospace' }}>{hora}</span>
                    <span style={{ fontSize: '10px', color: '#9CA3AF' }}>hora de atención</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#5F6B7A' }}>{fecha}</div>
                </div>

                <div style={{ fontSize: '12px', color: '#5F6B7A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colorDoc }} />
                  <strong>Atendido por:</strong> {hcSeleccionada.medico}
                </div>
                <div style={{ fontSize: '12px', color: '#5F6B7A', marginBottom: '10px' }}><strong>Motivo:</strong> {hcSeleccionada.motivo}</div>

                <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: hcSeleccionada.firmada ? '#F0FDF4' : '#FEF2F2', color: hcSeleccionada.firmada ? '#16A34A' : '#DC2626' }}>
                  {hcSeleccionada.firmada ? '✓ Firmada digitalmente' : '⚠ Sin firma digital'}
                </span>
              </div>

              <button onClick={() => setTabActiva('timeline')}
                style={{ padding: '9px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}>
                ← Volver a la lista
              </button>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E8ECF0' }}>
                📋 Historia Clínica Completa
              </div>

              {Object.keys(sv).length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#C74634', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>🩺 Signos Vitales</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[['TA', sv.ta, 'mmHg'], ['FC', sv.fc, '/min'], ['SpO₂', sv.spo2, '%'], ['Temp', sv.temp, '°C']].map(([l, v, u]) => (
                      <div key={l as string} style={{ background: '#F5F7FA', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E', fontFamily: 'monospace' }}>{v as string}</div>
                        <div style={{ fontSize: '9px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{l as string} {u as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {[
                ['💬 Motivo de consulta', hcSeleccionada.motivo],
                ['📝 Anamnesis', hcSeleccionada.anamnesis],
                ['🔍 Examen físico', hcSeleccionada.examen_fisico],
                ['💊 Plan de manejo', hcSeleccionada.plan_manejo],
              ].map(([label, valor]) => valor && valor !== 'nan' && (
                <div key={label as string} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#C74634', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>{label as string}</div>
                  <div style={{ background: '#F5F7FA', borderLeft: '3px solid #C74634', borderRadius: '0 6px 6px 0', padding: '12px 14px', fontSize: '13px', color: '#1A1A2E', lineHeight: '1.7' }}>{valor as string}</div>
                </div>
              ))}

              {dxArr.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#C74634', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>🏥 Diagnósticos CIE-10</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {dxArr.map((dx, i) => (
                      <span key={i} style={{ fontSize: '12px', fontWeight: '700', padding: '5px 12px', borderRadius: '6px', background: '#F5F3FF', color: '#7C3AED', border: '1px solid #ede9fe' }}>
                        {dx.codigo} — {dx.descripcion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
