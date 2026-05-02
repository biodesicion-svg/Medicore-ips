'use client'

import { useState, useRef, useEffect } from 'react'
import { consultarGemini, MensajeGemini } from '@/lib/gemini'

interface Mensaje {
  id: string
  rol: 'usuario' | 'asistente'
  contenido: string
  hora: string
  error?: boolean
}

const CONSULTAS_RAPIDAS: Record<string, string[]> = {
  '🩺 Clínico': [
    '¿Cuál es el protocolo de manejo para HTA grado 2 en adultos?',
    '¿Hay interacciones entre Losartán 100mg y Amlodipino 5mg?',
    '¿Cuáles son los criterios diagnósticos para Diabetes tipo 2?',
    '¿Cuál es la dosis pediátrica de Amoxicilina para faringoamigdalitis?',
    '¿Cuándo se indica hospitalización por neumonía?',
  ],
  '📋 Normativa': [
    '¿Qué exige la Resolución 3100/2019 sobre historia clínica?',
    '¿Cuáles son los plazos de envío de RIPS según Res. 2275/2023?',
    '¿Cuántos años debe custodiarse una historia clínica?',
    '¿Qué dice la Ley 1581/2012 sobre datos de pacientes?',
    '¿Qué debe tener una factura electrónica en salud?',
  ],
  '🔬 Biomédico': [
    '¿Cuándo reportar un evento adverso al INVIMA? (Decreto 4725)',
    '¿Cómo se clasifican los dispositivos médicos en Colombia?',
    '¿Con qué frecuencia calibrar un desfibrilador Clase III?',
    '¿Qué es tecnovigilancia y obligaciones de una IPS?',
    '¿Qué documentos debe tener la hoja de vida de un equipo?',
  ],
  '📊 Gestión': [
    '¿Cuáles son los indicadores SOGCS obligatorios para una IPS?',
    '¿Cómo reducir el índice de glosas en facturación a EPS?',
    '¿Qué diferencia hay entre telemedicina y teleconsulta?',
    'Explícame el Sistema de Garantía de Calidad SOGCS',
  ],
}

function getHora(): string {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

export default function IAPage() {
  const [montado, setMontado] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      rol: 'asistente',
      contenido: '¡Hola! Soy el asistente clínico de MediCore IPS, impulsado por Google Gemini.\n\nPuedo ayudarte con:\n• Protocolos clínicos y farmacología\n• Normativa colombiana de salud\n• Gestión biomédica y tecnovigilancia\n• Indicadores de calidad SOGCS\n\n¿En qué te ayudo?',
      hora: '',
    },
  ])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const [grupoAbierto, setGrupoAbierto] = useState<string>('🩺 Clínico')
  const [apiKeyOk, setApiKeyOk] = useState(false)
  const mensajesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMontado(true)
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    setApiKeyOk(!!key && !key.includes('PON-TU-KEY') && key.length > 10)
  }, [])

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  const construirHistorial = (): MensajeGemini[] => {
    return mensajes
      .filter(m => m.id !== '1' && !m.error)
      .slice(-8)
      .map(m => ({
        role: m.rol === 'usuario' ? 'user' : 'model',
        parts: [{ text: m.contenido }],
      }))
  }

  const enviarMensaje = async (texto?: string) => {
    const contenido = (texto || input).trim()
    if (!contenido || cargando) return

    const hora = getHora()

    const msgUsuario: Mensaje = {
      id: Date.now().toString(),
      rol: 'usuario',
      contenido,
      hora,
    }

    setMensajes(prev => [...prev, msgUsuario])
    setInput('')
    setCargando(true)

    try {
      const historial = construirHistorial()
      const respuesta = await consultarGemini(contenido, historial)
      setMensajes(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        rol: 'asistente',
        contenido: respuesta,
        hora: getHora(),
      }])
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
      setMensajes(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        rol: 'asistente',
        contenido: `⚠️ ${errorMsg}`,
        hora: getHora(),
        error: true,
      }])
    } finally {
      setCargando(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  const limpiarChat = () => {
    setMensajes([{
      id: '1',
      rol: 'asistente',
      contenido: 'Chat reiniciado. ¿En qué te puedo ayudar?',
      hora: '',
    }])
  }

  const formatearTexto = (texto: string) => {
    return texto.split('\n').map((linea, i, arr) => {
      const partes = linea.split(/\*\*(.*?)\*\*/g)
      const lineaFormateada = partes.map((parte, j) =>
        j % 2 === 1 ? <strong key={j}>{parte}</strong> : parte
      )
      return (
        <span key={i}>
          {lineaFormateada}
          {i < arr.length - 1 && <br />}
        </span>
      )
    })
  }

  if (!montado) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 105px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            🤖 IA Clínica MediCore
            {apiKeyOk ? (
              <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: '#F0FDF4', color: '#16A34A', border: '1px solid #bbf7d0' }}>
                ● Activa — Gemini Flash
              </span>
            ) : (
              <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: '#FFFBEB', color: '#D97706', border: '1px solid #fde68a' }}>
                ⚠️ Configura API Key
              </span>
            )}
          </h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>
            Google Gemini 2.0 Flash · Normativa colombiana · Gestión biomédica
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
            style={{ padding: '7px 12px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '7px', fontSize: '11px', color: '#5F6B7A', textDecoration: 'none' }}>
            🔑 Obtener API Key gratis
          </a>
          <button onClick={limpiarChat}
            style={{ padding: '7px 12px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '7px', fontSize: '12px', color: '#5F6B7A', cursor: 'pointer', fontFamily: 'inherit' }}>
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {/* Banner sin API key */}
      {!apiKeyOk && (
        <div style={{ background: '#FFFBEB', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', marginBottom: '14px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#D97706', marginBottom: '4px' }}>⚠️ API Key de Gemini no configurada</div>
          <div style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.6' }}>
            1. Ve a <strong>aistudio.google.com</strong> → Get API Key → Create API key<br />
            2. Edita <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>.env.local</code> y agrega: <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>NEXT_PUBLIC_GEMINI_API_KEY=AIza...</code><br />
            3. Reinicia con <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>npm run dev</code>
          </div>
        </div>
      )}

      {/* Layout */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>

        {/* CHAT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden', minHeight: 0 }}>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mensajes.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: '10px', flexDirection: msg.rol === 'usuario' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.rol === 'usuario' ? '#FFF5F3' : '#F0FDF4', border: `1px solid ${msg.rol === 'usuario' ? '#ffd5cc' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {msg.rol === 'usuario' ? '👤' : '✨'}
                </div>
                <div style={{ maxWidth: '76%', padding: '12px 15px', borderRadius: msg.rol === 'usuario' ? '14px 3px 14px 14px' : '3px 14px 14px 14px', background: msg.rol === 'usuario' ? '#FFF5F3' : msg.error ? '#FEF2F2' : '#F8FFFE', border: `1px solid ${msg.rol === 'usuario' ? '#ffd5cc' : msg.error ? '#fecaca' : '#d1fae5'}`, fontSize: '13px', lineHeight: '1.75', color: '#1A1A2E' }}>
                  {formatearTexto(msg.contenido)}
                  {msg.hora && (
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '6px', fontFamily: 'monospace' }}>
                      {msg.rol === 'asistente' && !msg.error && '✨ Gemini · '}{msg.hora}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {cargando && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0FDF4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✨</div>
                <div style={{ padding: '14px 18px', background: '#F8FFFE', border: '1px solid #d1fae5', borderRadius: '3px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Gemini está pensando...</span>
                </div>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid #E8ECF0', display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta clínica... (Enter para enviar, Shift+Enter nueva línea)"
              disabled={cargando}
              rows={2}
              style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: '1.5', color: '#1A1A2E' }}
              onFocus={e => e.target.style.borderColor = '#C74634'}
              onBlur={e => e.target.style.borderColor = '#E8ECF0'}
            />
            <button
              onClick={() => enviarMensaje()}
              disabled={cargando || !input.trim()}
              style={{ padding: '10px 20px', background: cargando || !input.trim() ? '#E8ECF0' : '#C74634', color: cargando || !input.trim() ? '#9CA3AF' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: cargando || !input.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', flexShrink: 0, height: '44px' }}>
              {cargando ? '⏳' : 'Enviar'}
            </button>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div style={{ width: '270px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
            ⚡ Consultas rápidas
          </div>

          {Object.entries(CONSULTAS_RAPIDAS).map(([grupo, preguntas]) => (
            <div key={grupo} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '8px', overflow: 'hidden' }}>
              <button onClick={() => setGrupoAbierto(grupoAbierto === grupo ? '' : grupo)}
                style={{ width: '100%', padding: '10px 14px', background: grupoAbierto === grupo ? '#F5F7FA' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'inherit' }}>
                <span>{grupo}</span>
                <span style={{ color: '#9CA3AF', fontSize: '10px' }}>{grupoAbierto === grupo ? '▲' : '▼'}</span>
              </button>
              {grupoAbierto === grupo && (
                <div style={{ borderTop: '1px solid #E8ECF0' }}>
                  {preguntas.map((pregunta, i) => (
                    <button key={i} onClick={() => enviarMensaje(pregunta)} disabled={cargando}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', background: 'none', border: 'none', borderBottom: i < preguntas.length - 1 ? '1px solid #F5F7FA' : 'none', fontSize: '11px', color: '#5F6B7A', cursor: cargando ? 'not-allowed' : 'pointer', fontFamily: 'inherit', lineHeight: '1.4' }}
                      onMouseEnter={e => { if (!cargando) e.currentTarget.style.background = '#FFF5F3' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
                      {pregunta}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A', marginBottom: '4px' }}>✨ Google Gemini 2.0 Flash</div>
            <div style={{ fontSize: '10px', color: '#166534', lineHeight: '1.6', fontFamily: 'monospace' }}>
              • 15 solicitudes/minuto gratis<br />
              • 1,500 solicitudes/día gratis<br />
              • aistudio.google.com
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
