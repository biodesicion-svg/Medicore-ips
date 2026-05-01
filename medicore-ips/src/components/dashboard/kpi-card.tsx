'use client'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
  icon: string
  color: string
  barColor: string
  delay?: number
}

export default function KpiCard({ label, value, delta, deltaType = 'neutral', icon, color, barColor }: KpiCardProps) {
  const deltaColors = {
    up: { bg: '#F0FDF4', text: '#16A34A' },
    down: { bg: '#FEF2F2', text: '#DC2626' },
    neutral: { bg: '#EFF6FF', text: '#1D4ED8' },
  }
  const dc = deltaColors[deltaType]

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #E8ECF0',
        borderRadius: '10px',
        padding: '18px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: barColor, borderRadius: '0 0 10px 10px' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {label}
        </div>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-1px', marginBottom: '8px', lineHeight: 1 }}>
        {value}
      </div>

      {delta && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: dc.bg, color: dc.text, fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
          {deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '→'} {delta}
        </div>
      )}
    </div>
  )
}
