import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import KpiCard from '@/components/dashboard/kpi-card'
import DashboardCharts from '@/components/dashboard/charts'
import MedicosTable from '@/components/dashboard/medicos-table'

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const StethoscopeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
  </svg>
)
const MoneyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const EquipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H3m6 0h12M3 14v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5M3 14h18"/>
  </svg>
)
const ToolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)
const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
)
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const rol = session.user.rol
  const hoy = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const titulo: Record<string, string> = {
    director: 'Dashboard General',
    medico: 'Mi Dashboard',
    biomedico: 'Dashboard Biomédico',
    facturacion: 'Dashboard Facturación',
    enfermero: 'Panel de Enfermería',
  }

  const sectionTitle = (t: string, sub: string) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace' }}>{sub}</div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{t}</div>
    </div>
  )

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px', fontFamily: 'monospace' }}>
            {hoy}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            {titulo[rol] || 'Dashboard'}
          </h1>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '9px 16px',
          background: 'var(--primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius)',
          fontSize: '13px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(37,99,235,0.3)',
          transition: 'all 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar reporte
        </button>
      </div>

      {/* DIRECTOR */}
      {rol === 'director' && (
        <>
          {sectionTitle('Indicadores clínicos', 'Actividad del día')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <KpiCard label="Citas hoy" value="48" delta="8% vs ayer" deltaType="up" icon={<CalendarIcon />} accentColor="#2563EB" />
            <KpiCard label="Pacientes activos" value="1.247" delta="+23 este mes" deltaType="up" icon={<UsersIcon />} accentColor="#059669" />
            <KpiCard label="Médicos activos" value="18" delta="6 especialidades" deltaType="neutral" icon={<StethoscopeIcon />} accentColor="#7C3AED" />
            <KpiCard label="Facturación mes" value="$82M" delta="15% vs anterior" deltaType="up" icon={<MoneyIcon />} accentColor="#D97706" />
          </div>

          {sectionTitle('Operaciones', 'Estado en tiempo real')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <KpiCard label="Equipos operativos" value="34/38" delta="4 en mantenimiento" deltaType="down" icon={<EquipIcon />} accentColor="#0891B2" />
            <KpiCard label="En mantenimiento" value="4" delta="Fuera de servicio" deltaType="down" icon={<ToolIcon />} accentColor="#DC2626" />
            <KpiCard label="HC sin firmar" value="3" delta="Requiere atención" deltaType="down" icon={<FileIcon />} accentColor="#DC2626" />
            <KpiCard label="RIPS pendiente" value="47" delta="Plazo: hoy" deltaType="down" icon={<SendIcon />} accentColor="#D97706" />
          </div>

          <DashboardCharts rol="director" />
          <MedicosTable />
        </>
      )}

      {/* MÉDICO */}
      {rol === 'medico' && (
        <>
          {sectionTitle('Mis indicadores del día', 'Actividad personal')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <KpiCard label="Mis citas hoy" value="12" delta="Asignadas" deltaType="neutral" icon={<CalendarIcon />} accentColor="#2563EB" />
            <KpiCard label="Completadas" value="8" delta="67% del día" deltaType="up" icon={<UsersIcon />} accentColor="#059669" />
            <KpiCard label="Pendientes" value="4" delta="Próxima en 15 min" deltaType="neutral" icon={<StethoscopeIcon />} accentColor="#D97706" />
            <KpiCard label="HC sin firmar" value="3" delta="Urgente" deltaType="down" icon={<FileIcon />} accentColor="#DC2626" />
          </div>
        </>
      )}

      {/* BIOMÉDICO */}
      {rol === 'biomedico' && (
        <>
          {sectionTitle('Estado del parque tecnológico', 'Biomédica')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <KpiCard label="Equipos operativos" value="34/38" delta="89.5% disponibilidad" deltaType="neutral" icon={<EquipIcon />} accentColor="#059669" />
            <KpiCard label="OTs abiertas" value="5" delta="2 críticas" deltaType="down" icon={<ToolIcon />} accentColor="#DC2626" />
            <KpiCard label="Calibración vencida" value="1" delta="CRÍTICO" deltaType="down" icon={<FileIcon />} accentColor="#DC2626" />
            <KpiCard label="Costo mantto. mes" value="$4.2M" delta="OPEX biomédico" deltaType="neutral" icon={<MoneyIcon />} accentColor="#2563EB" />
          </div>
        </>
      )}

      {/* FACTURACIÓN */}
      {rol === 'facturacion' && (
        <>
          {sectionTitle('Indicadores financieros', 'Facturación')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <KpiCard label="Facturado mes" value="$82M" delta="15% vs anterior" deltaType="up" icon={<MoneyIcon />} accentColor="#059669" />
            <KpiCard label="Facturas emitidas" value="1.247" delta="Mes actual" deltaType="neutral" icon={<FileIcon />} accentColor="#2563EB" />
            <KpiCard label="Glosas activas" value="23" delta="$4.2M en disputa" deltaType="down" icon={<SendIcon />} accentColor="#D97706" />
            <KpiCard label="Cartera vencida" value="$12M" delta="+90 días" deltaType="down" icon={<MoneyIcon />} accentColor="#DC2626" />
          </div>
          <DashboardCharts rol="director" />
        </>
      )}
    </div>
  )
}
