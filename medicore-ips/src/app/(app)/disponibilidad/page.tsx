'use client'

import { useState } from 'react'

const equiposDisp = [
  { id: 'EQ-001', nombre: 'Ventilador Mecánico UCI', ubicacion: 'UCI Piso 2', estado: 'operativo', disponibilidad: 98.2, horasOperacion: 4320, horasParada: 78, ultimoMant: '10 Abr 2025', clase: 'III' },
  { id: 'EQ-004', nombre: 'Monitor Multiparámetro', ubicacion: 'Urgencias', estado: 'operativo', disponibilidad: 91.5, horasOperacion: 3890, horasParada: 360, ultimoMant: '28 Mar 2025', clase: 'IIb' },
  { id: 'EQ-007', nombre: 'Desfibrilador Bifásico', ubicacion: 'Urgencias', estado: 'revision', disponibilidad: 72.3, horasOperacion: 2980, horasParada: 1140, ultimoMant: '12 Abr 2025', clase: 'III' },
  { id: 'EQ-012', nombre: 'Ecógrafo Portátil', ubicacion: 'Consulta 3', estado: 'operativo', disponibilidad: 95.8, horasOperacion: 4180, horasParada: 182, ultimoMant: '05 Abr 2025', clase: 'IIa' },
  { id: 'EQ-015', nombre: 'Bomba de Infusión', ubicacion: 'UCI Piso 1', estado: 'mantenimiento', disponibilidad: 68.4, horasOperacion: 2820, horasParada: 1302, ultimoMant: '01 Mar 2025', clase: 'IIb' },
  { id: 'EQ-018', nombre: 'Rayos X Digital', ubicacion: 'Imágenes', estado: 'operativo', disponibilidad: 96.1, horasOperacion: 4200, horasParada: 168, ultimoMant: '15 Abr 2025', clase: 'IIb' },
  { id: 'EQ-021', nombre: 'Autoclave 120L', ubicacion: 'Central Est.', estado: 'operativo', disponibilidad: 88.7, horasOperacion: 3870, horasParada: 492, ultimoMant: '20 Mar 2025', clase: 'IIa' },
  { id: 'EQ-025', nombre: 'Glucómetro x5', ubicacion: 'Varios', estado: 'operativo', disponibilidad: 99.1, horasOperacion: 4330, horasParada: 38, ultimoMant: '25 Abr 2025', clase: 'IIa' },
]

export default function DisponibilidadPage() {
  const [vista, setVista] = useState<'general' | 'individual'>('general')
  const [equipoSel, setEquipoSel] = useState(equiposDisp[0])

  const dispGlobal = Math.round(equiposDisp.reduce((a, e) => a + e.disponibilidad, 0) / equiposDisp.length * 10) / 10
  const operativos = equiposDisp.filter(e => e.estado === 'operativo').length
  const enMant = equiposDisp.filter(e => e.estado === 'mantenimiento').length
  const enRevision = equiposDisp.filter(e => e.estado === 'revision').length

  const colorDisp = (d: number) => d >= 95 ? '#16A34A' : d >= 80 ? '#D97706' : '#DC2626'
  const colorEstado = (e: string) => e === 'operativo' ? { bg: '#F0FDF4', text: '#16A34A' } : e === 'mantenimiento' ? { bg: '#F5F3FF', text: '#7C3AED' } : { bg: '#FFFBEB', text: '#D97706' }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📡 Disponibilidad de Equipos</h1>
        <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Monitoreo general e individual · ISO 55001 · Decreto 4725/2005</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Disponibilidad global', value: `${dispGlobal}%`, color: colorDisp(dispGlobal), icon: '📡' },
          { label: 'Equipos operativos', value: `${operativos}/${equiposDisp.length}`, color: '#16A34A', icon: '✅' },
          { label: 'En mantenimiento', value: enMant, color: '#7C3AED', icon: '🔧' },
          { label: 'En revisión', value: enRevision, color: '#D97706', icon: '⚠️' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '20px', marginTop: '4px' }}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['general', 'individual'] as const).map(v => (
          <button key={v} onClick={() => setVista(v)}
            style={{ padding: '8px 18px', borderRadius: '7px', border: `1.5px solid ${vista === v ? '#C74634' : '#E8ECF0'}`, background: vista === v ? '#FFF5F3' : '#fff', color: vista === v ? '#C74634' : '#5F6B7A', fontWeight: vista === v ? '700' : '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {v === 'general' ? '📊 Vista general' : '🔍 Vista individual'}
          </button>
        ))}
      </div>

      {vista === 'general' && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['Equipo', 'Ubicación', 'Clase', 'Estado', 'Disponibilidad', 'Horas operación', 'Horas parada', 'Último mantto.'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equiposDisp.map(eq => {
                const ec = colorEstado(eq.estado)
                return (
                  <tr key={eq.id} style={{ borderBottom: '1px solid #E8ECF0', cursor: 'pointer' }}
                    onClick={() => { setEquipoSel(eq); setVista('individual') }}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{eq.nombre}</div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>{eq.id}</div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5F6B7A' }}>{eq.ubicacion}</td>
                    <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8' }}>{eq.clase}</span></td>
                    <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: ec.bg, color: ec.text }}>{eq.estado}</span></td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: '#E8ECF0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${eq.disponibilidad}%`, height: '100%', background: colorDisp(eq.disponibilidad), borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: colorDisp(eq.disponibilidad), fontFamily: 'monospace' }}>{eq.disponibilidad}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#1D4ED8', fontWeight: '600' }}>{eq.horasOperacion.toLocaleString()}h</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: '12px', color: eq.horasParada > 500 ? '#DC2626' : '#5F6B7A' }}>{eq.horasParada.toLocaleString()}h</td>
                    <td style={{ padding: '11px 14px', fontSize: '11px', color: '#5F6B7A', fontFamily: 'monospace' }}>{eq.ultimoMant}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {vista === 'individual' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {equiposDisp.map(eq => (
              <div key={eq.id} onClick={() => setEquipoSel(eq)}
                style={{ background: equipoSel.id === eq.id ? '#FFF5F3' : '#fff', border: `1.5px solid ${equipoSel.id === eq.id ? '#C74634' : '#E8ECF0'}`, borderRadius: '8px', padding: '12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1A2E' }}>{eq.nombre}</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace', margin: '2px 0' }}>{eq.id} · {eq.ubicacion}</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: colorDisp(eq.disponibilidad) }}>{eq.disponibilidad}%</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>{equipoSel.nombre}</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', marginBottom: '20px' }}>{equipoSel.id} · Clase {equipoSel.clase} · {equipoSel.ubicacion}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Disponibilidad', value: `${equipoSel.disponibilidad}%`, color: colorDisp(equipoSel.disponibilidad) },
                { label: 'Estado actual', value: equipoSel.estado, color: colorEstado(equipoSel.estado).text },
                { label: 'Horas de operación', value: `${equipoSel.horasOperacion.toLocaleString()}h`, color: '#1D4ED8' },
                { label: 'Horas de parada', value: `${equipoSel.horasParada.toLocaleString()}h`, color: equipoSel.horasParada > 500 ? '#DC2626' : '#5F6B7A' },
              ].map(m => (
                <div key={m.label} style={{ background: '#F5F7FA', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{m.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: m.color, fontFamily: 'monospace' }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: '#1A1A2E' }}>Disponibilidad histórica (simulada — 12 meses)</div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80px' }}>
                {[92, 95, 88, 91, 96, 89, 93, 97, 90, 94, 88, equipoSel.disponibilidad].map((v, i) => (
                  <div key={i} style={{ flex: 1, background: i === 11 ? '#C74634' : colorDisp(v), borderRadius: '3px 3px 0 0', height: `${v}%`, position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '8px', color: '#9CA3AF', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
