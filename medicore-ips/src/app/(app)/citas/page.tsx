'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { toast } from 'sonner'
import { ESPECIALIDADES, EPS_LISTA } from '@/lib/constants'

const LBL: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }
const INP: CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #E8ECF0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff' }

const HORAS = Array.from({ length: 21 }, (_, i) => {
  const mins = 7 * 60 + i * 30
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
})

function getWeekDays(base: Date): Date[] {
  const day = base.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(base)
  mon.setDate(base.getDate() + diff)
  return Array.from({ length: 5 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d })
}

function MiniCalendar({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  const [view, setView] = useState(new Date())
  const today = new Date()
  const y = view.getFullYear(), m = view.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const label = view.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button onClick={() => setView(new Date(y, m - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#5F6B7A', lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#1A1A2E', textTransform: 'capitalize' }}>{label}</span>
        <button onClick={() => setView(new Date(y, m + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#5F6B7A', lineHeight: 1 }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '9px', color: '#9CA3AF', fontWeight: '700', padding: '3px 0' }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const isToday = day === today.getDate() && m === today.getMonth() && y === today.getFullYear()
          const isSel = day === selected.getDate() && m === selected.getMonth() && y === selected.getFullYear()
          return (
            <div key={i} onClick={() => onSelect(new Date(y, m, day))}
              style={{ textAlign: 'center', fontSize: '11px', padding: '5px 2px', borderRadius: '50%', cursor: 'pointer', background: isSel ? '#C74634' : isToday ? '#FFF5F3' : 'transparent', color: isSel ? '#fff' : isToday ? '#C74634' : '#1A1A2E', fontWeight: isToday || isSel ? '700' : '400' }}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface FormCita { paciente: string; especialidad: string; medico: string; fecha: string; hora: string; motivo: string; eps: string; canal: string }
const VACIO: FormCita = { paciente: '', especialidad: '', medico: '', fecha: new Date().toISOString().split('T')[0], hora: '08:00', motivo: '', eps: '', canal: 'WhatsApp' }

export default function CitasPage() {
  const today = new Date()
  const [selected, setSelected] = useState(today)
  const [weekBase, setWeekBase] = useState(today)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormCita>({ ...VACIO })
  const weekDays = getWeekDays(weekBase)
  const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']

  const abrirModal = (fecha?: string, hora?: string) => {
    setForm({ ...VACIO, fecha: fecha ?? VACIO.fecha, hora: hora ?? VACIO.hora })
    setModal(true)
  }
  const guardar = () => {
    if (!form.paciente.trim() || !form.especialidad) { toast.error('Paciente y especialidad son obligatorios'); return }
    toast.success('Cita guardada (demo) — conecta Oracle para persistir')
    setModal(false)
  }
  const prevWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d) }
  const nextWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📅 Agendamiento de Citas</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Res. 1552/2013 · Gestión de agenda médica</p>
        </div>
        <button onClick={() => abrirModal()} style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Nueva cita
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px' }}>
            <MiniCalendar selected={selected} onSelect={d => { setSelected(d); setWeekBase(d) }} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1A2E', marginBottom: '12px' }}>
              Citas de hoy — {today.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>📭</div>
              <div style={{ fontSize: '12px' }}>No hay citas programadas para hoy</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #E8ECF0' }}>
            <button onClick={prevWeek} style={{ background: 'none', border: '1px solid #E8ECF0', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '14px', color: '#5F6B7A' }}>←</button>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>
              {weekDays[0].toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} — {weekDays[4].toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button onClick={nextWeek} style={{ background: 'none', border: '1px solid #E8ECF0', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '14px', color: '#5F6B7A' }}>→</button>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ background: '#F5F7FA' }}>
                  <th style={{ width: '56px', padding: '8px', borderRight: '1px solid #E8ECF0' }} />
                  {weekDays.map((d, i) => {
                    const isHoy = d.toDateString() === today.toDateString()
                    return (
                      <th key={i} style={{ padding: '8px', textAlign: 'center', borderRight: i < 4 ? '1px solid #E8ECF0' : 'none' }}>
                        <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '700' }}>{DIAS[i]}</div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', marginTop: '2px', background: isHoy ? '#C74634' : 'transparent', color: isHoy ? '#fff' : '#1A1A2E', fontSize: '13px', fontWeight: '700' }}>
                          {d.getDate()}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {HORAS.map(hora => (
                  <tr key={hora} style={{ borderBottom: '1px solid #F5F7FA' }}>
                    <td style={{ padding: '4px 8px', fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace', textAlign: 'right', borderRight: '1px solid #E8ECF0', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{hora}</td>
                    {weekDays.map((d, ci) => (
                      <td key={ci}
                        onClick={() => abrirModal(d.toISOString().split('T')[0], hora)}
                        style={{ height: '30px', borderRight: ci < 4 ? '1px solid #F5F7FA' : 'none', cursor: 'pointer' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFF5F3' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>📅 Nueva cita</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={LBL}>Paciente *</label><input style={INP} value={form.paciente} onChange={e => setForm({ ...form, paciente: e.target.value })} placeholder="Nombre o número de documento" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Especialidad *</label>
                  <select style={INP} value={form.especialidad} onChange={e => setForm({ ...form, especialidad: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div><label style={LBL}>Médico</label><input style={INP} value={form.medico} onChange={e => setForm({ ...form, medico: e.target.value })} placeholder="Nombre del médico" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>Fecha</label><input type="date" style={INP} value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
                <div><label style={LBL}>Hora</label>
                  <select style={INP} value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })}>
                    {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={LBL}>Motivo de consulta</label><textarea style={{ ...INP, resize: 'vertical', minHeight: '70px' }} value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} placeholder="Describe el motivo..." /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LBL}>EPS / Aseguradora</label>
                  <select style={INP} value={form.eps} onChange={e => setForm({ ...form, eps: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {EPS_LISTA.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div><label style={LBL}>Canal recordatorio</label>
                  <select style={INP} value={form.canal} onChange={e => setForm({ ...form, canal: e.target.value })}>
                    {['WhatsApp', 'Email', 'SMS', 'Sin recordatorio'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={guardar} style={{ padding: '11px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                Confirmar cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
