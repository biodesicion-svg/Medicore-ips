'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MODULOS } from '@/lib/constants'
import { Rol } from '@/types'

interface SidebarProps { rol: Rol }

const ICONS: Record<string, JSX.Element> = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  citas: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  historia: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  pacientes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  biomedico: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H3m6 0h12M3 14v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5M3 14h18"/></svg>,
  mantenimiento: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  inventario: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  prediccion: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  disponibilidad: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ordenes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  comportamiento: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  'auditoria-bio': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  facturacion: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  rips: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  auditoria: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ia: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
}

const SECCIONES = [
  { label: 'PRINCIPAL', ids: ['dashboard'] },
  { label: 'CLÍNICO', ids: ['citas', 'historia', 'pacientes'] },
  { label: 'BIOMÉDICO', ids: ['biomedico', 'mantenimiento', 'inventario', 'prediccion', 'disponibilidad', 'ordenes', 'comportamiento', 'auditoria-bio'] },
  { label: 'ADMINISTRATIVO', ids: ['facturacion', 'rips', 'auditoria'] },
  { label: 'INTELIGENCIA', ids: ['ia'] },
]

export default function Sidebar({ rol }: SidebarProps) {
  const pathname = usePathname()
  const modulosVisibles = MODULOS.filter(m => m.rolesPermitidos.includes(rol))
  const idsVisibles = modulosVisibles.map(m => m.id)

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <div style={{ padding: '16px 12px', flex: 1 }}>
        {SECCIONES.map(seccion => {
          const modulosSeccion = modulosVisibles.filter(m => seccion.ids.includes(m.id) && idsVisibles.includes(m.id))
          if (modulosSeccion.length === 0) return null

          return (
            <div key={seccion.label} style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '10px', fontWeight: '600',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase', letterSpacing: '1px',
                padding: '0 10px',
                marginBottom: '4px',
                fontFamily: 'monospace',
              }}>
                {seccion.label}
              </div>

              {modulosSeccion.map(m => {
                const isActive = pathname.startsWith(m.href)
                const icon = ICONS[m.id]

                return (
                  <Link key={m.id} href={m.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius)',
                      marginBottom: '1px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      transition: 'all 0.12s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--slate-100)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}>

                    {/* Barra activa */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        left: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px', height: '20px',
                        background: 'var(--primary)',
                        borderRadius: '0 3px 3px 0',
                      }} />
                    )}

                    {/* Icono */}
                    <span style={{
                      display: 'flex', alignItems: 'center',
                      color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                      flexShrink: 0,
                      transition: 'color 0.12s',
                    }}>
                      {icon || <span style={{ fontSize: '14px' }}>{m.icon}</span>}
                    </span>

                    {/* Label */}
                    <span style={{ flex: 1, lineHeight: 1.3 }}>{m.label}</span>

                    {/* Badge */}
                    {m.badge && m.badgeColor && (
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: m.badgeColor === 'red' ? 'var(--danger)'
                          : m.badgeColor === 'amber' ? 'var(--warning)'
                          : m.badgeColor === 'green' ? 'var(--success)'
                          : 'var(--primary)',
                        color: '#fff',
                        lineHeight: '16px',
                        minWidth: '18px',
                        textAlign: 'center',
                      }}>
                        {m.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: '10px', color: 'var(--text-tertiary)',
          fontFamily: 'monospace', lineHeight: '1.8', textAlign: 'center',
        }}>
          MediCore IPS v1.0<br />
          ISO 27001 · Res. 3100/2019
        </div>
      </div>
    </aside>
  )
}
