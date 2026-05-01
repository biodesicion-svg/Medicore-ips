'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MODULOS } from '@/lib/constants'
import { Rol } from '@/types'

interface SidebarProps {
  rol: Rol
}

export default function Sidebar({ rol }: SidebarProps) {
  const pathname = usePathname()
  const modulosVisibles = MODULOS.filter(m => m.rolesPermitidos.includes(rol))

  const badgeStyle = (color: string) => ({
    fontSize: '9px',
    fontWeight: '700' as const,
    padding: '2px 6px',
    borderRadius: '10px',
    background: color === 'red' ? '#DC2626' : color === 'amber' ? '#D97706' : color === 'green' ? '#16A34A' : '#1D4ED8',
    color: '#ffffff',
    minWidth: '16px',
    textAlign: 'center' as const,
  })

  return (
    <aside style={{ width: '220px', background: '#ffffff', borderRight: '1px solid #E8ECF0', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
      <div style={{ padding: '14px 10px 8px' }}>
        <div style={{ fontSize: '9px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '0 8px 8px', fontFamily: 'monospace' }}>
          Módulos
        </div>

        {modulosVisibles.map((modulo) => {
          const isActive = pathname.startsWith(modulo.href)
          return (
            <Link
              key={modulo.id}
              href={modulo.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '7px',
                marginBottom: '1px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#C74634' : '#5F6B7A',
                background: isActive ? '#FFF5F3' : 'transparent',
                position: 'relative',
                transition: 'all 0.15s',
                borderLeft: isActive ? '3px solid #C74634' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F5F7FA'
                  e.currentTarget.style.color = '#1A1A2E'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#5F6B7A'
                }
              }}
            >
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{modulo.icon}</span>
              <span style={{ flex: 1 }}>{modulo.label}</span>
              {modulo.badge && modulo.badgeColor && (
                <span style={badgeStyle(modulo.badgeColor)}>{modulo.badge}</span>
              )}
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid #E8ECF0' }}>
        <div style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace', textAlign: 'center', lineHeight: '1.8' }}>
          MediCore IPS v1.0<br />
          Oracle Cloud · ISO 27001<br />
          Res. 3100/2019
        </div>
      </div>
    </aside>
  )
}
