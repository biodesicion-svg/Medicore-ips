'use client'

import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'

interface HeaderProps {
  session: Session
}

export default function Header({ session }: HeaderProps) {
  const { user } = session

  return (
    <header style={{ height: '56px', background: '#ffffff', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', zIndex: 10 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '220px', flexShrink: 0 }}>
        <div style={{ width: '30px', height: '30px', background: '#FFF5F3', border: '1px solid #ffd5cc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏥</div>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E' }}>
          Medi<span style={{ color: '#C74634' }}>Core</span>
        </span>
      </div>

      <div style={{ flex: 1, maxWidth: '360px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '7px 12px' }}>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>🔍</span>
          <input
            placeholder="Buscar paciente, equipo, cita..."
            style={{ border: 'none', background: 'none', fontSize: '13px', color: '#1A1A2E', outline: 'none', width: '100%', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <button style={{ width: '34px', height: '34px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '15px' }}>
            🔔
          </button>
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#DC2626', borderRadius: '50%', border: '1.5px solid #ffffff' }}></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F7FA', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '5px 10px' }}>
          <div style={{ fontSize: '18px' }}>
            {user.rol === 'director' ? '👨‍⚕️' : user.rol === 'medico' ? '👩‍⚕️' : user.rol === 'enfermero' ? '🧑‍⚕️' : user.rol === 'biomedico' ? '🔬' : '💼'}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1A2E', lineHeight: 1.2 }}>{user.nombre || user.name}</div>
            <div style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace' }}>{user.rol}</div>
          </div>
        </div>

        <button
          onClick={async () => {
            try { await signOut({ redirect: false }) } catch { /* ignore */ }
            window.location.replace('/login')
          }}
          style={{ fontSize: '11px', color: '#9CA3AF', cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E8ECF0', background: '#ffffff', fontFamily: 'inherit', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#DC2626' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#E8ECF0' }}
        >
          ⏻ Salir
        </button>
      </div>
    </header>
  )
}
