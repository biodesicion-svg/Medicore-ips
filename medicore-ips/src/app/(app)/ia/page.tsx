'use client'

import { useState, useRef, useEffect } from 'react'

interface Msg { id: string; role: 'user' | 'assistant'; content: string }

const BIENVENIDA: Msg = {
  id: '0', role: 'assistant',
  content: 'Hola, soy el asistente clínico de MediCore IPS. Puedo ayudarte con consultas clínicas, normativa colombiana, gestión biomédica y más. ¿En qué te puedo ayudar hoy?',
}

const CONSULTAS: Record<string, string[]> = {
  'Clínico': [
    '¿Protocolo para HTA grado 2?',
    'Interacciones: Losartán + Amlodipino',
    'Criterios diagnósticos diabetes tipo 2',
    'Dosis pediátrica amoxicilina 500mg',
  ],
  'Normativa colombiana': [
    '¿Qué exige Res. 3100/2019 sobre HCs?',
    'Plazos de envío RIPS (Res. 2275/2023)',
    'Requisitos habilitación IPS (Res. 3100)',
    'Custodia de historias clínicas',
  ],
  'Biomédico': [
    '¿Cuándo reportar a INVIMA? (Decreto 4725)',
    'Clasificación de riesgo dispositivos médicos',
    'Frecuencia calibración equipos Clase III',
    '¿Qué es tecnovigilancia?',
  ],
  'Gestión': [
    'Genera resumen ejecutivo del día',
    '¿Cómo reducir glosas en facturación?',
    'Indicadores SOGCS obligatorios para IPS',
  ],
}

export default function IaPage() {
  const [mensajes, setMensajes] = useState<Msg[]>([BIENVENIDA])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensajes, loading])

  const enviar = async (texto?: string) => {
    const pregunta = (texto ?? input).trim()
    if (!pregunta || loading) return
    setInput('')
    const uid = Date.now().toString()
    setMensajes(prev => [...prev, { id: uid, role: 'user', content: pregunta }])
    setLoading(true)
    try {
      const res = await fetch('/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: pregunta }) })
      if (res.status === 503) {
        setNoKey(true)
        setMensajes(prev => [...prev, { id: uid + '_r', role: 'assistant', content: '⚠️ API key no configurada. Agrega tu ANTHROPIC_API_KEY en .env.local para activar la IA clínica.' }])
      } else {
        const data = await res.json()
        setMensajes(prev => [...prev, { id: uid + '_r', role: 'assistant', content: data.reply ?? 'Sin respuesta' }])
      }
    } catch {
      setMensajes(prev => [...prev, { id: uid + '_r', role: 'assistant', content: 'Error de conexión. Verifica que el servidor esté activo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px - 48px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🤖 IA Clínica MediCore</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Claude Sonnet · Asistente clínico con IA</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: noKey ? '#FFFBEB' : '#F0FDF4', border: `1px solid ${noKey ? '#fde68a' : '#bbf7d0'}`, borderRadius: '20px', padding: '4px 12px' }}>
          <span style={{ width: '6px', height: '6px', background: noKey ? '#D97706' : '#16A34A', borderRadius: '50%', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', color: noKey ? '#D97706' : '#16A34A', fontWeight: '600' }}>{noKey ? 'Sin configurar' : 'Activa'}</span>
        </div>
      </div>

      {noKey && (
        <div style={{ background: '#FFFBEB', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 16px', marginBottom: '12px', fontSize: '12px', color: '#D97706', flexShrink: 0 }}>
          ⚠️ Configura tu <code style={{ fontFamily: 'monospace', background: '#fef3c7', padding: '1px 5px', borderRadius: '3px' }}>ANTHROPIC_API_KEY</code> en <code style={{ fontFamily: 'monospace', background: '#fef3c7', padding: '1px 5px', borderRadius: '3px' }}>.env.local</code> para activar la IA clínica
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', flex: 1, minHeight: 0 }}>
        {/* Chat */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mensajes.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
                {m.role === 'assistant' && <div style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>🤖</div>}
                <div style={{ maxWidth: '75%', background: m.role === 'user' ? '#FFF5F3' : '#F5F7FA', border: `1px solid ${m.role === 'user' ? '#ffd5cc' : '#E8ECF0'}`, borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px', padding: '10px 14px', fontSize: '13px', color: '#1A1A2E', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>
                {m.role === 'user' && <div style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>👤</div>}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ fontSize: '20px' }}>🤖</div>
                <div style={{ background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '2px 12px 12px 12px', padding: '10px 14px', fontSize: '13px', color: '#9CA3AF' }}>
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E8ECF0', display: 'flex', gap: '8px' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
              placeholder="Escribe tu consulta clínica... (Enter para enviar, Shift+Enter para nueva línea)"
              style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', resize: 'none', height: '60px', fontFamily: 'inherit', outline: 'none' }}
            />
            <button onClick={() => enviar()} disabled={loading || !input.trim()}
              style={{ padding: '10px 18px', background: loading || !input.trim() ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Enviar
            </button>
          </div>
        </div>

        {/* Panel de consultas rápidas */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'auto', padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>⚡ Consultas rápidas</div>
          {Object.entries(CONSULTAS).map(([grupo, preguntas]) => (
            <div key={grupo} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{grupo}</div>
              {preguntas.map(q => (
                <button key={q} onClick={() => enviar(q)} disabled={loading}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '6px', fontSize: '11px', color: '#5F6B7A', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '4px', fontFamily: 'inherit', lineHeight: '1.4' }}>
                  {q}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
