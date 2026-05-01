'use client'

import { toast } from 'sonner'

const KPIS = [
  { label: 'Registros pendientes', value: '0', color: '#D97706', icon: '📋' },
  { label: 'Enviados este mes', value: '0', color: '#16A34A', icon: '📤' },
  { label: 'Rechazados', value: '0', color: '#DC2626', icon: '❌' },
  { label: 'Próximo envío', value: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }), color: '#1D4ED8', icon: '📅' },
]

const TIPOS_RIPS = [
  { codigo: 'CT', desc: 'Consulta de urgencias y hospitalización' },
  { codigo: 'AP', desc: 'Procedimientos diagnósticos y terapéuticos' },
  { codigo: 'AT', desc: 'Urgencias' },
  { codigo: 'AN', desc: 'Recién nacido' },
  { codigo: 'AC', desc: 'Otros servicios de salud' },
]

export default function RipsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '4px' }}>📤 RIPS / EPS</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>Res. 2275/2023 · MinSalud · Registro Individual de Prestación de Servicios</p>
        </div>
        <button onClick={() => toast.info('Conecta Oracle para generar y enviar RIPS')}
          style={{ padding: '9px 18px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          📤 Enviar RIPS
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

      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              {['Período', 'EPS', 'Registros', 'Fecha envío', 'Estado', 'CUV', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📤</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>No hay envíos de RIPS registrados — conecta Oracle para generar los registros</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ background: '#EFF6FF', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '18px 20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1D4ED8', marginBottom: '12px' }}>📋 Requisitos RIPS — Res. 2275/2023</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {TIPOS_RIPS.map(t => (
            <div key={t.codigo} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', background: '#1D4ED8', color: '#fff', flexShrink: 0, fontFamily: 'monospace', marginTop: '1px' }}>{t.codigo}</span>
              <span style={{ fontSize: '12px', color: '#1D4ED8' }}>{t.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#1D4ED8', fontFamily: 'monospace' }}>
          <span>📄 Formato: JSON estructurado</span>
          <span>⏱️ Plazo máximo: 2 días hábiles después de la atención</span>
        </div>
      </div>
    </div>
  )
}
