'use client'

import { useState } from 'react'

const equipos = [
  { id: 'EQ-007', nombre: 'Desfibrilador Bifásico', clase: 'III', probabilidad: 92, nivel: 'critico', recomendacion: 'Calibración correctiva inmediata. Riesgo de falla en equipos de soporte vital.', mtbf: 320, mttr: 8.2, ultimaFalla: '12 Abr 2025', calibracionVence: 'VENCIDA' },
  { id: 'EQ-004', nombre: 'Monitor Multiparámetro', clase: 'IIb', probabilidad: 67, nivel: 'alto', recomendacion: 'Reemplazo de batería urgente. Vida útil al 45%. Programar OT en 3 días.', mtbf: 580, mttr: 4.1, ultimaFalla: '28 Mar 2025', calibracionVence: '15 May 2025' },
  { id: 'EQ-001', nombre: 'Ventilador Mecánico UCI', clase: 'III', probabilidad: 18, nivel: 'bajo', recomendacion: 'Equipo en buen estado. Mantener programa de mantenimiento preventivo mensual.', mtbf: 1240, mttr: 2.8, ultimaFalla: '05 Ene 2025', calibracionVence: '30 Jun 2025' },
  { id: 'EQ-012', nombre: 'Ecógrafo Portátil', clase: 'IIa', probabilidad: 34, nivel: 'medio', recomendacion: 'Revisar transductores en próximo mantenimiento. Riesgo moderado de degradación de imagen.', mtbf: 890, mttr: 3.5, ultimaFalla: '18 Feb 2025', calibracionVence: '01 Jul 2025' },
  { id: 'EQ-021', nombre: 'Autoclave 120L', clase: 'IIa', probabilidad: 45, nivel: 'medio', recomendacion: 'Validación de ciclo de esterilización pendiente. Programar con proveedor esta semana.', mtbf: 720, mttr: 5.0, ultimaFalla: '02 Mar 2025', calibracionVence: '20 May 2025' },
]

export default function PrediccionPage() {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(equipos[0])
  const [preguntaIA, setPreguntaIA] = useState('')
  const [respuestaIA, setRespuestaIA] = useState('')
  const [loadingIA, setLoadingIA] = useState(false)

  const colorNivel = (nivel: string) => {
    if (nivel === 'critico') return { bg: '#FEF2F2', text: '#DC2626', bar: '#DC2626' }
    if (nivel === 'alto') return { bg: '#FFFBEB', text: '#D97706', bar: '#D97706' }
    if (nivel === 'medio') return { bg: '#FFF7ED', text: '#EA580C', bar: '#EA580C' }
    return { bg: '#F0FDF4', text: '#16A34A', bar: '#16A34A' }
  }

  const consultarIA = async () => {
    if (!preguntaIA.trim()) return
    setLoadingIA(true)
    try {
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Equipo: ${equipoSeleccionado.nombre} (${equipoSeleccionado.id}), Clase ${equipoSeleccionado.clase}. MTBF: ${equipoSeleccionado.mtbf}h, MTTR: ${equipoSeleccionado.mttr}h, Última falla: ${equipoSeleccionado.ultimaFalla}, Calibración: ${equipoSeleccionado.calibracionVence}, Probabilidad de falla 30 días: ${equipoSeleccionado.probabilidad}%. Pregunta del ingeniero: ${preguntaIA}`,
        }),
      })
      const data = await res.json()
      setRespuestaIA(data.reply || 'Sin respuesta')
    } catch {
      setRespuestaIA('Error al consultar la IA')
    } finally {
      setLoadingIA(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🧠 Predicción IA — Equipos Biomédicos</h1>
        <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Mantenimiento predictivo · Machine Learning · Decreto 4725/2005</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {equipos.map(eq => {
          const c = colorNivel(eq.nivel)
          const isSelected = equipoSeleccionado.id === eq.id
          return (
            <div key={eq.id} onClick={() => setEquipoSeleccionado(eq)}
              style={{ background: isSelected ? c.bg : '#ffffff', border: `2px solid ${isSelected ? c.bar : '#E8ECF0'}`, borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E' }}>{eq.nombre}</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>{eq.id} · Clase {eq.clase}</div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: c.bg, color: c.text, border: `1px solid ${c.bar}30` }}>
                  {eq.nivel.toUpperCase()}
                </span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#5F6B7A' }}>Probabilidad de falla (30 días)</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: c.text }}>{eq.probabilidad}%</span>
                </div>
                <div style={{ height: '6px', background: '#E8ECF0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${eq.probabilidad}%`, height: '100%', background: c.bar, borderRadius: '3px', transition: 'width 0.5s' }} />
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#5F6B7A', lineHeight: '1.5' }}>{eq.recomendacion}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📊 Indicadores — {equipoSeleccionado.nombre}</div>
          {[
            ['MTBF (Tiempo medio entre fallas)', `${equipoSeleccionado.mtbf} horas`, '#1D4ED8'],
            ['MTTR (Tiempo medio de reparación)', `${equipoSeleccionado.mttr} horas`, '#16A34A'],
            ['Última falla registrada', equipoSeleccionado.ultimaFalla, '#D97706'],
            ['Calibración — próximo vencimiento', equipoSeleccionado.calibracionVence, equipoSeleccionado.calibracionVence === 'VENCIDA' ? '#DC2626' : '#16A34A'],
            ['Probabilidad falla 30 días', `${equipoSeleccionado.probabilidad}%`, colorNivel(equipoSeleccionado.nivel).bar],
          ].map(([label, val, color]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #E8ECF0' }}>
              <span style={{ fontSize: '12px', color: '#5F6B7A' }}>{label as string}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: color as string, fontFamily: 'monospace' }}>{val as string}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>🤖 Consultar IA sobre este equipo</div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', background: '#F5F7FA', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px' }}>
            Equipo activo: {equipoSeleccionado.nombre} ({equipoSeleccionado.id})
          </div>
          <textarea
            value={preguntaIA}
            onChange={e => setPreguntaIA(e.target.value)}
            placeholder="Ej: ¿Cuándo debo programar el próximo mantenimiento? ¿Qué repuestos necesito?"
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8ECF0', borderRadius: '8px', fontSize: '13px', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit', outline: 'none', marginBottom: '10px' }}
          />
          <button onClick={consultarIA} disabled={loadingIA}
            style={{ width: '100%', padding: '10px', background: loadingIA ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: loadingIA ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {loadingIA ? '⏳ Consultando IA...' : '🧠 Consultar IA predictiva'}
          </button>
          {respuestaIA && (
            <div style={{ marginTop: '12px', background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#1A1A2E', lineHeight: '1.7' }}>
              <strong style={{ color: '#16A34A' }}>🤖 Respuesta IA:</strong><br />
              {respuestaIA}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
