'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Equipo {
  id: string
  nombre: string
  codigo_interno?: string
  clase_riesgo: string
  marca?: string
  modelo?: string
  serial?: string
  ubicacion?: string
  estado: string
  vida_util_pct?: number
  proximo_mant?: string
  prox_calibracion?: string
  frecuencia_mant?: string
  proveedor_mant?: string
  observaciones?: string
  created_at: string
}

function colorEstado(estado: string) {
  if (estado === 'operativo') return { bg: '#F0FDF4', text: '#16A34A' }
  if (estado === 'mantenimiento') return { bg: '#F5F3FF', text: '#7C3AED' }
  if (estado === 'revision') return { bg: '#FFFBEB', text: '#D97706' }
  return { bg: '#FEF2F2', text: '#DC2626' }
}

function colorVida(pct?: number) {
  if (!pct) return '#9CA3AF'
  if (pct >= 70) return '#16A34A'
  if (pct >= 40) return '#D97706'
  return '#DC2626'
}

function formatearFecha(fecha?: string): string {
  if (!fecha) return '—'
  try { return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return fecha }
}

export default function BiomedicoPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [filtrados, setFiltrados] = useState<Equipo[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [equipoDetalle, setEquipoDetalle] = useState<Equipo | null>(null)
  const [form, setForm] = useState({
    nombre: '', codigo_interno: '', clase_riesgo: 'IIb',
    marca: '', modelo: '', serial: '', ubicacion: '',
    estado: 'operativo', vida_util_pct: '100',
    proximo_mant: '', prox_calibracion: '',
    frecuencia_mant: 'Mensual', proveedor_mant: '', observaciones: ''
  })
  const [stats, setStats] = useState({ total: 0, operativos: 0, mantenimiento: 0, baja: 0 })

  useEffect(() => { cargarEquipos() }, [])

  useEffect(() => {
    const b = busqueda.toLowerCase()
    setFiltrados(equipos.filter(e => {
      const coincideBusqueda = (e.nombre || '').toLowerCase().includes(b) ||
        (e.codigo_interno || '').toLowerCase().includes(b) ||
        (e.marca || '').toLowerCase().includes(b) ||
        (e.ubicacion || '').toLowerCase().includes(b)
      const coincideEstado = filtroEstado === 'todos' || e.estado === filtroEstado
      return coincideBusqueda && coincideEstado
    }))
  }, [busqueda, filtroEstado, equipos])

  async function cargarEquipos() {
    setCargando(true)
    const { data, error } = await supabase
      .from('equipos')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setEquipos(data)
      setFiltrados(data)
      setStats({
        total: data.length,
        operativos: data.filter(e => e.estado === 'operativo').length,
        mantenimiento: data.filter(e => e.estado === 'mantenimiento').length,
        baja: data.filter(e => e.estado === 'baja').length,
      })
    }
    setCargando(false)
  }

  async function guardarEquipo() {
    if (!form.nombre || !form.codigo_interno) {
      toast.error('Nombre y código son obligatorios')
      return
    }
    setGuardando(true)
    const { error } = await supabase.from('equipos').insert([{
      ...form,
      vida_util_pct: parseInt(form.vida_util_pct) || 100,
    }])
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('Equipo registrado correctamente')
      setModalAbierto(false)
      setForm({ nombre: '', codigo_interno: '', clase_riesgo: 'IIb', marca: '', modelo: '', serial: '', ubicacion: '', estado: 'operativo', vida_util_pct: '100', proximo_mant: '', prox_calibracion: '', frecuencia_mant: 'Mensual', proveedor_mant: '', observaciones: '' })
      cargarEquipos()
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
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🔬 Equipos Biomédicos</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Decreto 4725/2005 · Res. 3100/2019 · {stats.total} equipos en Supabase</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Buscar por nombre, código, marca o ubicación..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 14px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '300px', background: '#F5F7FA' }}
            onFocus={e => e.target.style.borderColor = '#C74634'}
            onBlur={e => e.target.style.borderColor = '#E8ECF0'}
          />
          <button onClick={() => setModalAbierto(true)}
            style={{ padding: '8px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            + Nuevo equipo
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total equipos', value: stats.total, color: '#1D4ED8', icon: '🔬' },
          { label: 'Operativos', value: stats.operativos, color: '#16A34A', icon: '✅' },
          { label: 'En mantenimiento', value: stats.mantenimiento, color: '#7C3AED', icon: '🔧' },
          { label: 'Dados de baja', value: stats.baja, color: '#DC2626', icon: '❌' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{k.icon} {k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, letterSpacing: '-1px' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[['todos', 'Todos'], ['operativo', 'Operativos'], ['mantenimiento', 'En mantenimiento'], ['revision', 'En revisión'], ['baja', 'Dados de baja']].map(([val, label]) => (
          <button key={val} onClick={() => setFiltroEstado(val)}
            style={{ padding: '6px 14px', borderRadius: '6px', border: `1.5px solid ${filtroEstado === val ? '#C74634' : '#E8ECF0'}`, background: filtroEstado === val ? '#FFF5F3' : '#fff', color: filtroEstado === val ? '#C74634' : '#5F6B7A', fontWeight: filtroEstado === val ? '700' : '500', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tabla o detalle */}
      {equipoDetalle ? (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderTop: `4px solid ${colorEstado(equipoDetalle.estado).text}`, borderRadius: '10px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔬</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E', marginBottom: '6px' }}>{equipoDetalle.nombre}</div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF', marginBottom: '12px' }}>{equipoDetalle.codigo_interno}</div>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: colorEstado(equipoDetalle.estado).bg, color: colorEstado(equipoDetalle.estado).text }}>{equipoDetalle.estado}</span>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[['Marca', equipoDetalle.marca], ['Modelo', equipoDetalle.modelo], ['Serial', equipoDetalle.serial], ['Ubicación', equipoDetalle.ubicacion], ['Clase riesgo', equipoDetalle.clase_riesgo], ['Proveedor', equipoDetalle.proveedor_mant]].map(([l, v]) => v && (
                  <div key={l as string} style={{ fontSize: '12px', color: '#5F6B7A' }}>
                    <strong style={{ color: '#1A1A2E' }}>{l as string}:</strong> {v as string}
                  </div>
                ))}
              </div>
              {equipoDetalle.vida_util_pct && (
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Vida útil</div>
                  <div style={{ height: '8px', background: '#E8ECF0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${equipoDetalle.vida_util_pct}%`, height: '100%', background: colorVida(equipoDetalle.vida_util_pct), borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: colorVida(equipoDetalle.vida_util_pct), marginTop: '4px' }}>{equipoDetalle.vida_util_pct}%</div>
                </div>
              )}
            </div>
            <button onClick={() => setEquipoDetalle(null)}
              style={{ padding: '9px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}>
              ← Volver al inventario
            </button>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E8ECF0' }}>
              📋 Hoja de vida del equipo
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {[['Próximo mantenimiento', formatearFecha(equipoDetalle.proximo_mant)], ['Próxima calibración', formatearFecha(equipoDetalle.prox_calibracion)], ['Frecuencia mantto.', equipoDetalle.frecuencia_mant || '—'], ['Fecha registro', formatearFecha(equipoDetalle.created_at)]].map(([l, v]) => (
                <div key={l as string} style={{ background: '#F5F7FA', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{l as string}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E' }}>{v as string}</div>
                </div>
              ))}
            </div>
            {equipoDetalle.observaciones && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#C74634', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Observaciones</div>
                <div style={{ background: '#F5F7FA', borderLeft: '3px solid #C74634', borderRadius: '0 6px 6px 0', padding: '12px 14px', fontSize: '13px', color: '#1A1A2E', lineHeight: '1.7' }}>{equipoDetalle.observaciones}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {cargando ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>Cargando equipos desde Supabase...</div>
          ) : filtrados.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔬</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '6px' }}>No hay equipos</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Ajusta los filtros o agrega un nuevo equipo</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['Equipo', 'Código', 'Clase', 'Marca / Modelo', 'Ubicación', 'Estado', 'Vida útil', 'Próx. Mantto.', 'Ver'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', borderBottom: '1px solid #E8ECF0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((eq, i) => {
                  const ec = colorEstado(eq.estado)
                  return (
                    <tr key={eq.id} style={{ borderBottom: '1px solid #E8ECF0', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF5F3'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'}>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{eq.nombre}</div>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '11px', fontFamily: 'monospace', color: '#C74634', fontWeight: '700' }}>{eq.codigo_interno || '—'}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8' }}>{eq.clase_riesgo}</span>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5F6B7A' }}>{eq.marca}{eq.modelo ? ` · ${eq.modelo}` : ''}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5F6B7A' }}>{eq.ubicacion || '—'}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: ec.bg, color: ec.text }}>{eq.estado}</span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {eq.vida_util_pct ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '50px', height: '6px', background: '#E8ECF0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${eq.vida_util_pct}%`, height: '100%', background: colorVida(eq.vida_util_pct), borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: colorVida(eq.vida_util_pct), fontFamily: 'monospace' }}>{eq.vida_util_pct}%</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '11px', color: '#5F6B7A', fontFamily: 'monospace' }}>{formatearFecha(eq.proximo_mant)}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <button onClick={() => setEquipoDetalle(eq)}
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

      {/* Modal nuevo equipo */}
      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false) }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <span style={{ fontSize: '20px' }}>🔬</span>
              <div style={{ fontSize: '17px', fontWeight: '800', flex: 1 }}>Nuevo Equipo Biomédico</div>
              <button onClick={() => setModalAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {inp('nombre', 'Nombre del equipo', 'text', 'Ej: Ventilador Mecánico UCI')}
                {inp('codigo_interno', 'Código interno', 'text', 'EQ-001')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                {sel('clase_riesgo', 'Clase de riesgo', ['Clase I', 'Clase IIa', 'Clase IIb', 'Clase III'])}
                {inp('marca', 'Marca', 'text', 'Philips, GE, Mindray...')}
                {inp('modelo', 'Modelo', 'text', 'Modelo del equipo')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {inp('serial', 'Número de serie', 'text', 'SN-XXXXXXXX')}
                {inp('ubicacion', 'Ubicación', 'text', 'UCI, Urgencias, Consulta 3...')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                {sel('estado', 'Estado', ['operativo', 'mantenimiento', 'revision', 'baja'])}
                {inp('vida_util_pct', 'Vida útil (%)', 'number', '100')}
                {sel('frecuencia_mant', 'Frecuencia mantto.', ['Mensual', 'Trimestral', 'Semestral', 'Anual'])}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {inp('proximo_mant', 'Próximo mantenimiento', 'date')}
                {inp('prox_calibracion', 'Próxima calibración', 'date')}
              </div>
              {inp('proveedor_mant', 'Proveedor de mantenimiento', 'text', 'TechMed S.A.S, PhilipsCare...')}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })}
                  placeholder="Notas adicionales sobre el equipo..."
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '70px', background: '#F5F7FA' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalAbierto(false)}
                  style={{ padding: '9px 18px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}>
                  Cancelar
                </button>
                <button onClick={guardarEquipo} disabled={guardando}
                  style={{ padding: '9px 18px', background: guardando ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {guardando ? 'Guardando...' : '💾 Registrar equipo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
