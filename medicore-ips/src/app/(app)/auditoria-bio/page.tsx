'use client'

import { useState } from 'react'

const eventosAuditoria = [
  { id: 'EA-001', equipo: 'Desfibrilador EQ-007', tipo: 'Falla en descarga', fecha: '12 Abr 2025', severidad: 'critico', reportado: true, descripcion: 'Equipo no entregó energía programada de 200J. Detectado en prueba de rutina.' },
  { id: 'EA-002', equipo: 'Bomba Inf. EQ-015', tipo: 'Alarma falsa positiva', fecha: '03 Mar 2025', severidad: 'moderado', reportado: true, descripcion: 'Alarma de oclusión activada sin obstrucción real. Revisión del sensor.' },
  { id: 'EA-003', equipo: 'Monitor EQ-003', tipo: 'Lectura SpO2 errática', fecha: '18 Feb 2025', severidad: 'leve', reportado: true, descripcion: 'Sensor de oximetría mostraba lecturas inconsistentes. Calibración correctiva.' },
]

const preguntasSugeridas = [
  '¿Debo reportar este evento al INVIMA?',
  '¿Cuál es el plazo de reporte para fallas críticas?',
  '¿Qué documentación requiere una OT de calibración?',
  'Genera un resumen de cumplimiento normativo',
]

export default function AuditoriaBioPage() {
  const [consultaIA, setConsultaIA] = useState('')
  const [respuestaIA, setRespuestaIA] = useState('')
  const [loadingIA, setLoadingIA] = useState(false)

  const colorSev = (s: string) => s === 'critico' ? { bg: '#FEF2F2', text: '#DC2626' } : s === 'moderado' ? { bg: '#FFFBEB', text: '#D97706' } : { bg: '#F0FDF4', text: '#16A34A' }

  const consultarAuditoriaIA = async () => {
    if (!consultaIA.trim()) return
    setLoadingIA(true)
    try {
      const contexto = `Eres un auditor de tecnovigilancia biomédica colombiana. Contexto del sistema: ${eventosAuditoria.length} eventos adversos registrados. Último evento crítico: ${eventosAuditoria[0].descripcion} (Equipo: ${eventosAuditoria[0].equipo}). Normativa aplicable: Decreto 4725/2005, Res. 4816/2008 INVIMA, Res. 914/2025. Pregunta del auditor: ${consultaIA}`
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contexto }),
      })
      const data = await res.json()
      setRespuestaIA(data.reply || 'Sin respuesta')
    } catch {
      setRespuestaIA('Error al consultar')
    } finally {
      setLoadingIA(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🤖 Auditoría IA Biomédica</h1>
        <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Tecnovigilancia · INVIMA · Decreto 4725/2005 · Res. 914/2025</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>📋 Registro de eventos adversos</div>
          {eventosAuditoria.map(ev => {
            const c = colorSev(ev.severidad)
            return (
              <div key={ev.id} style={{ background: c.bg, border: `1px solid ${c.text}20`, borderLeft: `3px solid ${c.text}`, borderRadius: '0 8px 8px 0', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#1A1A2E' }}>{ev.equipo}</span>
                  <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px', background: c.bg, color: c.text, border: `1px solid ${c.text}30` }}>{ev.severidad.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '4px' }}>{ev.tipo}</div>
                <div style={{ fontSize: '11px', color: '#5F6B7A', marginBottom: '6px', lineHeight: '1.5' }}>{ev.descripcion}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>{ev.fecha}</span>
                  <span style={{ fontSize: '10px', color: ev.reportado ? '#16A34A' : '#DC2626', fontWeight: '700' }}>
                    {ev.reportado ? '✓ Reportado INVIMA' : '⚠️ Pendiente'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>🤖 Asistente IA de Auditoría</div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', background: '#F5F7FA', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', lineHeight: '1.6' }}>
            Especializado en tecnovigilancia colombiana · Decreto 4725/2005 · INVIMA · ISO 13485
          </div>
          {preguntasSugeridas.map(q => (
            <button key={q} onClick={() => setConsultaIA(q)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '6px', fontSize: '12px', color: '#5F6B7A', cursor: 'pointer', marginBottom: '6px', fontFamily: 'inherit' }}>
              💬 {q}
            </button>
          ))}
          <textarea
            value={consultaIA}
            onChange={e => setConsultaIA(e.target.value)}
            placeholder="Haz una pregunta sobre tecnovigilancia, normativa o auditoría..."
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit', outline: 'none', marginBottom: '10px', marginTop: '6px' }}
          />
          <button onClick={consultarAuditoriaIA} disabled={loadingIA}
            style={{ width: '100%', padding: '10px', background: loadingIA ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: loadingIA ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {loadingIA ? '⏳ Consultando IA...' : '🤖 Consultar auditoría IA'}
          </button>
          {respuestaIA && (
            <div style={{ marginTop: '12px', background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#1A1A2E', lineHeight: '1.7' }}>
              <strong style={{ color: '#16A34A' }}>🤖 Respuesta IA:</strong><br />
              {respuestaIA}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>📊 Resumen de cumplimiento normativo</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { norma: 'Decreto 4725/2005', estado: 'Cumple', detalle: 'Hojas de vida y OTs al día', color: '#16A34A' },
            { norma: 'Res. 4816/2008 INVIMA', estado: 'Cumple', detalle: 'Eventos adversos reportados', color: '#16A34A' },
            { norma: 'ISO 13485:2016', estado: 'Parcial', detalle: 'Calibración EQ-007 vencida', color: '#D97706' },
            { norma: 'Res. 914/2025', estado: 'Revisión', detalle: 'Actualizando protocolos', color: '#DC2626' },
          ].map(n => (
            <div key={n.norma} style={{ background: '#F5F7FA', borderRadius: '8px', padding: '14px', borderLeft: `3px solid ${n.color}` }}>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#5F6B7A', marginBottom: '6px' }}>{n.norma}</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: n.color, marginBottom: '4px' }}>{n.estado}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{n.detalle}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
