'use client'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  accentColor: string
  delay?: number
}

export default function KpiCard({ label, value, delta, deltaType = 'neutral', icon, accentColor, delay = 0 }: KpiCardProps) {
  const deltaColors = {
    up:      { bg: 'var(--success-light)',  text: 'var(--success)',  symbol: '↑' },
    down:    { bg: 'var(--danger-light)',   text: 'var(--danger)',   symbol: '↓' },
    neutral: { bg: 'var(--primary-light)',  text: 'var(--primary)',  symbol: '→' },
  }
  const dc = deltaColors[deltaType]

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}>

      {/* Accent line top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px', background: accentColor,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          fontSize: '11px', fontWeight: '600',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase', letterSpacing: '0.8px',
          lineHeight: 1.4,
        }}>
          {label}
        </div>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: 'var(--radius)',
          background: accentColor + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor, flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontSize: '28px', fontWeight: '800',
        color: 'var(--text-primary)',
        letterSpacing: '-1px', lineHeight: 1,
        marginBottom: '10px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>

      {/* Delta */}
      {delta && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          background: dc.bg, color: dc.text,
          fontSize: '11px', fontWeight: '600',
          padding: '3px 8px', borderRadius: 'var(--radius-full)',
        }}>
          <span>{dc.symbol}</span>
          <span>{delta}</span>
        </div>
      )}
    </div>
  )
}
