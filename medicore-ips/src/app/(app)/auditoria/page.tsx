'use client'

import { useState } from 'react'
import { toast } from 'sonner'

type Tab = 'log' | 'cumplimiento' | 'accesos'

const KPIS = [
  { label: 'Cumplimiento global', value: '— %', color: '#9CA3AF', icon: '🛡️' },
  { label: 'Eventos adversos', value: '0', color: '#DC2626', icon: '⚠️' },
  { label: 'Accesos auditados', value: '0', color: '#1D4ED8', icon: '🔍' },
  { label: 'Satisfacción', value: '— %', color: '#9CA3AF', icon: '⭐' },
]

const NORMAS = [
  { nombre: 'Res. 3100/2019', descripcion: 'Historia Clínica Digital' },
  { nombre: 'Res. 2275/2023', descripcion: 'RIPS JSON MinSalud' },
  { nombre: 'Ley 1581/2012', descripcion: 'Habeas Data / Protección datos' },
  { nombre: 'ISO 27001', descripcion: 'Seguridad de la Información' },
  { nombre: 'Decreto 4725/2005', descripcion: 'Equipos Biomédicos INVIMA' },
  { nombre: 'Res. 042/2020', descripcion: 'Facturación Electrónica DIAN' },
  { nombre: 'ISO 9001', descripcion: 'Sistema de Gestión de Calidad' },
]

export default function AuditoriaPage() {
  const [tab, setTab] = useState<Tab>('log')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>🛡️ Auditoría y Calidad</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>ISO 27001 · NTC 27799 · SOGCS · Trazabilidad de accesos</p>
        </div>
        <button onClick={() => toast.info('Conecta Oracle para exportar el log de auditoría')}
          style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          📊 Exportar log
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {KPIS.map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '20px', marginTop: '4px' }}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {([['log', '📋 Log de actividad'], ['cumplimiento', '✅ Cumplimiento normativo'], ['accesos', '🔑 Accesos']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '8px 14px', borderRadius: '7px', border: `1.5px solid ${tab === key ? '#C74634' : '#E8ECF0'}`, background: tab === key ? '#FFF5F3' : '#fff', color: tab === key ? '#C74634' : '#5F6B7A', fontWeight: tab === key ? '700' : '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['Fecha/Hora', 'Usuario', 'Acción', 'Módulo', 'Registro', 'IP'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🛡️</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>No hay registros de auditoría aún. Los registros aparecen automáticamente con el uso del sistema</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === 'cumplimiento' && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>Normas aplicables a la IPS</span>
            <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>Conecta Oracle para ver cumplimiento real</span>
          </div>
          {NORMAS.map(n => (
            <div key={n.nombre} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid #F5F7FA' }}>
              <div style={{ width: '160px', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'monospace' }}>{n.nombre}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{n.descripcion}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '6px', background: '#E8ECF0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: '#16A34A', borderRadius: '3px' }} />
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', width: '36px', textAlign: 'right' }}>0%</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'accesos' && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['Usuario', 'Rol', 'Último acceso', 'Módulos visitados', 'Intentos fallidos', 'Estado cuenta'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔑</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>No hay registros de accesos — conecta Oracle para ver el historial</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
