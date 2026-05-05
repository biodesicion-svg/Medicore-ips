'use client'

import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { useState } from 'react'

interface HeaderProps { session: Session }

const ROL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  director:    { label: 'Director Médico',    color: '#059669', bg: '#ECFDF5' },
  medico:      { label: 'Médico',             color: '#2563EB', bg: '#EFF6FF' },
  enfermero:   { label: 'Enfermero',          color: '#7C3AED', bg: '#F5F3FF' },
  biomedico:   { label: 'Ing. Biomédico',     color: '#D97706', bg: '#FFFBEB' },
  facturacion: { label: 'Facturación',        color: '#0891B2', bg: '#ECFEFF' },
}

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function Header({ session }: HeaderProps) {
  const { user } = session
  const rol = user.rol || 'director'
  const rolConfig = ROL_CONFIG[rol] || ROL_CONFIG.director
  const [saliendo, setSaliendo] = useState(false)

  const handleLogout = async () => {
    setSaliendo(true)
    try {
      await signOut({ redirect: false })
    } finally {
      window.location.replace('/login')
    }
  }

  const iniciales = (user.nombre || user.name || 'U')
    .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <header style={{
      height: 'var(--header-h)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '12px',
      flexShrink: 0,
      boxShadow: 'var(--shadow-xs)',
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'var(--sidebar-w)', flexShrink: 0 }}>
        <div style={{
          width: '30px', height: '30px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            Medi<span style={{ color: 'var(--primary)' }}>Core</span>
          </div>
          <div style={{ fontSize: '9px', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace' }}>
            IPS · v1.0
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--slate-50)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '7px 12px',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
          onFocus={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--primary)'
            el.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'
          }}
          onBlur={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border)'
            el.style.boxShadow = 'none'
          }}
          tabIndex={-1}
        >
          <span style={{ color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>
            <SearchIcon />
          </span>
          <input
            placeholder="Buscar paciente, equipo, cita..."
            style={{
              border: 'none', background: 'none',
              fontSize: '13px', color: 'var(--text-primary)',
              outline: 'none', width: '100%',
              fontFamily: 'inherit',
            }}
          />
          <kbd style={{
            fontSize: '10px', color: 'var(--text-tertiary)',
            background: 'var(--slate-200)', borderRadius: '4px',
            padding: '1px 5px', fontFamily: 'monospace',
            flexShrink: 0,
          }}>⌘K</kbd>
        </div>
      </div>

      {/* Derecha */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Notificaciones */}
        <button style={{
          width: '34px', height: '34px',
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
          position: 'relative', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}>
          <BellIcon />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '6px', height: '6px',
            background: 'var(--danger)',
            borderRadius: '50%',
            border: '1.5px solid var(--surface)',
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', color: '#fff',
            flexShrink: 0,
          }}>
            {iniciales}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {(user.nombre || user.name || '').split(' ')[0]} {(user.nombre || user.name || '').split(' ')[1] || ''}
            </div>
            <div style={{
              fontSize: '10px', fontWeight: '600',
              padding: '1px 6px', borderRadius: 'var(--radius-full)',
              background: rolConfig.bg, color: rolConfig.color,
              display: 'inline-block',
            }}>
              {rolConfig.label}
            </div>
          </div>
        </div>

        {/* Botón salir */}
        <button
          onClick={handleLogout}
          disabled={saliendo}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '6px 10px',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '12px', fontWeight: '500',
            color: 'var(--text-secondary)',
            cursor: saliendo ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
            marginLeft: '4px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--danger-light)'
            e.currentTarget.style.borderColor = 'var(--danger-border)'
            e.currentTarget.style.color = 'var(--danger)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}>
          <LogoutIcon />
          {saliendo ? 'Saliendo...' : 'Salir'}
        </button>
      </div>
    </header>
  )
}
