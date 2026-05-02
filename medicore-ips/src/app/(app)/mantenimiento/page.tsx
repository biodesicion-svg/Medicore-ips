'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface OT {
  id: string
  equipo_nombre: string
  tipo: string
  prioridad: string
  tecnico?: string
  fecha_prog?: string
  fecha_ejec?: string
  estado: string
  descripcion?: string
  horas_estimadas?: number
  costo_estimado?: number
  created_at: string
}

function colorPrioridad(p: string) {
  if (p === 'urgente') return { bg: '#FEF2F2', text: '#DC2626', dot: '#DC2626' }
  if (p === 'alta') return { bg: '#FFFBEB', text: '#D97706', dot: '#D97706' }
  return { bg: '#F0FDF4', text: '#16A34A', dot: '#16A34A' }
}

function colorEstado(e: string) {
  if (e === 'abierta') return { bg: '#FEF2F2', text: '#DC2626' }
  if (e === 'en_proceso') return { bg: '#EFF6FF', text: '#1D4ED8' }
  if (e === 'completada') return { bg: '#F0FDF4', text: '#16A34A' }
  return { bg: '#F5F7FA', text: '#9CA3AF' }
}

function colorTipo(t: string) {
  if (t === 'correctivo') return { bg: '#FEF2F2', text: '#DC2626' }
  if (t === 'preventivo') return { bg: '#EFF6FF', text: '#1D4ED8' }
  if (t === 'calibracion') return { bg: '#F5F3FF', text: '#7C3AED' }
  return { bg: '#FFFBEB', text: '#D97706' }
}

function formatearFecha(fecha?: string): string {
  if (!fecha) return '—'
  try { return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return fecha }
}

export default function MantenimientoPage() {
  const [ots, setOts] = useState<OT[]>([])
  const [filtradas, setFiltradas] = useState<OT[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [stats, setStats] = useState({ total: 0, abiertas: 0, proceso: 0, completadas: 0 })
  const [form, setForm] = useState({
    equipo_nombre: '', tipo: 'preventivo', prioridad: 'normal',
    tecnico: '', fecha_prog: '', descripcion: '',
    horas_estimadas: '', costo_estimado: ''
  })

  useEffect(() => { cargarOTs() }, [])

  useEffect(() => {
    const b = busqueda.toLowerCase()
    setFiltradas(ots.filter(o => {
      const coincide = (o.equipo_nombre || '').toLowerCase().includes(b) ||
        (o.tecnico || '').toLowerCase().includes(b) ||
        (o.descripcion || '').toLowerCase().includes(b)
      const porEstado = filtroEstado === 'todos' || o.estado === filtroEstado
      const porTipo = filtroTipo === 'todos' || o.tipo === filtroTipo
      return coincide && porEstado && porTipo
    }))
  }, [busqueda, filtroEstado, filtroTipo, ots])

  async function cargarOTs() {
    setCargando(true)
    const { data, error } = await supabase
      .from('ordenes_trabajo')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setOts(data)
      setFiltradas(data)
      setStats({
        total: data.length,
        abiertas: data.filter(o => o.estado === 'abierta').length,
        proceso: data.filter(o => o.estado === 'en_proceso').length,
        completadas: data.filter(o => o.estado === 'completada').length,
      })
    }
    setCargando(false)
  }

  async function guardarOT() {
    if (!form.equipo_nombre || !form.tipo) {
      toast.error('Equipo y tipo son obligatorios')
      return
    }
    setGuardando(true)
    const { error } = await supabase.from('ordenes_trabajo').insert([{
      equipo_nombre: form.equipo_nombre,
      tipo: form.tipo,
      prioridad: form.prioridad,
      tecnico: form.tecnico,
      fecha_prog: form.fecha_prog || null,
      descripcion: form.descripcion,
      horas_estimadas: form.horas_estimadas ? parseFloat(form.horas_estimadas) : null,
      costo_estimado: form.costo_estimado ? parseFloat(form.costo_estimado) : null,
      estado: 'abierta'
    }])
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('Orden de trabajo creada correctamente')
      setPanelAbierto(false)
      setForm({ equipo_nombre: '', tipo: 'preventivo', prioridad: 'normal', tecnico: '', fecha_prog: '', descripcion: '', horas_estimadas: '', costo_estimado: '' })
      cargarOTs()
    }
    setGuardando(false)
  }

  async function cambiarEstado(id: string, nuevoEstado: string) {
    const { error } = await supabase
      .from('ordenes_trabajo')
      .update({ estado: nuevoEstado, fecha_ejec: nuevoEstado === 'completada' ? new Date().toISOString() : null })
      .eq('id', id)
    if (!error) {
      toast.success(`OT marcada como ${nuevoEstado}`)
      cargarOTs()
    }
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

  const sel = (field: string, label: string, options: [string, string][]) => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>{label}</label>
      <select value={form[field as keyof typeof form]} onChange={e => setForm({ ...form, [field]: e.target.value })}
        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA' }}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🔧 Mantenimiento Biomédico</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Decreto 4725/2005 · Res. 914/2025 · {stats.total} órdenes de trabajo</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Buscar por equipo, técnico o descripción..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 14px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '280px', background: '#F5F7FA' }}
            onFocus={e => e.target.style.borderColor = '#C74634'}
            onBlur={e => e.target.style.borderColor = '#E8ECF0'}
          />
          <button onClick={() => setPanelAbierto(!panelAbierto)}
            style={{ padding: '8px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            {panelAbierto ? '✕ Cancelar' : '+ Nueva OT'}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total OTs', value: stats.total, color: '#1D4ED8', icon: '📋' },
          { label: 'Abiertas', value: stats.abiertas, color: '#DC2626', icon: '🔴' },
          { label: 'En proceso', value: stats.proceso, color: '#1D4ED8', icon: '🔵' },
          { label: 'Completadas', value: stats.completadas, color: '#16A34A', icon: '✅' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{k.icon} {k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, letterSpacing: '-1px' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Panel nueva OT */}
      {panelAbierto && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E8ECF0' }}>
            🔧 Nueva Orden de Trabajo
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            {inp('equipo_nombre', 'Equipo', 'text', 'Nombre o código del equipo')}
            {inp('tecnico', 'Técnico responsable', 'text', 'Ing. Salcedo / TechMed S.A.S')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            {sel('tipo', 'Tipo', [['preventivo', 'Preventivo'], ['correctivo', 'Correctivo'], ['calibracion', 'Calibración'], ['metrologia', 'Metrología']])}
            {sel('prioridad', 'Prioridad', [['normal', 'Normal'], ['alta', 'Alta'], ['urgente', 'Urgente — Crítico']])}
            {inp('fecha_prog', 'Fecha programada', 'date')}
            {inp('horas_estimadas', 'Horas estimadas', 'number', '4')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            {inp('costo_estimado', 'Costo estimado ($)', 'number', '0')}
            <div />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>Descripción del trabajo</label>
            <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción detallada del trabajo a realizar..."
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '80px', background: '#F5F7FA' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => setPanelAbierto(false)}
              style={{ padding: '9px 18px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5F6B7A' }}>
              Cancelar
            </button>
            <button onClick={guardarOT} disabled={guardando}
              style={{ padding: '9px 18px', background: guardando ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {guardando ? 'Guardando...' : '🔧 Crear OT'}
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['todos', 'Todos estados'], ['abierta', 'Abiertas'], ['en_proceso', 'En proceso'], ['completada', 'Completadas'], ['cancelada', 'Canceladas']].map(([val, label]) => (
            <button key={val} onClick={() => setFiltroEstado(val)}
              style={{ padding: '5px 12px', borderRadius: '6px', border: `1.5px solid ${filtroEstado === val ? '#C74634' : '#E8ECF0'}`, background: filtroEstado === val ? '#FFF5F3' : '#fff', color: filtroEstado === val ? '#C74634' : '#5F6B7A', fontWeight: filtroEstado === val ? '700' : '500', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ width: '1px', background: '#E8ECF0', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['todos', 'Todos tipos'], ['preventivo', 'Preventivo'], ['correctivo', 'Correctivo'], ['calibracion', 'Calibración'], ['metrologia', 'Metrología']].map(([val, label]) => (
            <button key={val} onClick={() => setFiltroTipo(val)}
              style={{ padding: '5px 12px', borderRadius: '6px', border: `1.5px solid ${filtroTipo === val ? '#1D4ED8' : '#E8ECF0'}`, background: filtroTipo === val ? '#EFF6FF' : '#fff', color: filtroTipo === val ? '#1D4ED8' : '#5F6B7A', fontWeight: filtroTipo === val ? '700' : '500', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla OTs */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {cargando ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>Cargando órdenes de trabajo desde Supabase...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔧</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '6px' }}>No hay órdenes de trabajo</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Crea la primera con + Nueva OT</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['Equipo', 'Tipo', 'Prioridad', 'Técnico', 'Fecha prog.', 'Horas', 'Costo est.', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', borderBottom: '1px solid #E8ECF0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((ot, i) => {
                const ep = colorPrioridad(ot.prioridad)
                const ee = colorEstado(ot.estado)
                const et = colorTipo(ot.tipo)
                return (
                  <tr key={ot.id} style={{ borderBottom: '1px solid #E8ECF0', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5F3'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ot.equipo_nombre || '—'}</div>
                      {ot.descripcion && <div style={{ fontSize: '10px', color: '#9CA3AF', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ot.descripcion}</div>}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: et.bg, color: et.text }}>{ot.tipo}</span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: ep.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: ep.text }}>{ot.prioridad}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5F6B7A' }}>{ot.tecnico || '—'}</td>
                    <td style={{ padding: '11px 14px', fontSize: '11px', color: '#5F6B7A', fontFamily: 'monospace' }}>{formatearFecha(ot.fecha_prog)}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5F6B7A', fontFamily: 'monospace' }}>{ot.horas_estimadas ? `${ot.horas_estimadas}h` : '—'}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', fontFamily: 'monospace', color: ot.costo_estimado ? '#16A34A' : '#9CA3AF', fontWeight: ot.costo_estimado ? '700' : '400' }}>
                      {ot.costo_estimado ? `$${ot.costo_estimado.toLocaleString('es-CO')}` : '—'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: ee.bg, color: ee.text }}>{ot.estado.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {ot.estado === 'abierta' && (
                          <button onClick={() => cambiarEstado(ot.id, 'en_proceso')}
                            style={{ padding: '3px 8px', background: '#EFF6FF', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', color: '#1D4ED8', fontWeight: '700' }}>
                            Iniciar
                          </button>
                        )}
                        {ot.estado === 'en_proceso' && (
                          <button onClick={() => cambiarEstado(ot.id, 'completada')}
                            style={{ padding: '3px 8px', background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', color: '#16A34A', fontWeight: '700' }}>
                            Completar
                          </button>
                        )}
                        {ot.estado !== 'completada' && ot.estado !== 'cancelada' && (
                          <button onClick={() => cambiarEstado(ot.id, 'cancelada')}
                            style={{ padding: '3px 8px', background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', color: '#DC2626', fontWeight: '700' }}>
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
