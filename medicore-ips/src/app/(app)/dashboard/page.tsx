import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import KpiCard from '@/components/dashboard/kpi-card'
import DashboardCharts from '@/components/dashboard/charts'
import MedicosTable from '@/components/dashboard/medicos-table'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const rol = session.user.rol
  const hoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const datosDirector = {
    citasHoy: 48, pacientes: 1247, medicos: 18, facturacion: '$82M',
    equiposOp: 34, equiposTotal: 38, hcSinFirmar: 3, ripsPendiente: 47,
  }
  const datosMedico = { misGitas: 12, completadas: 8, pendientes: 4, hcSinFirmar: 3 }
  const datosBiomedico = { equiposOp: 34, otsAbiertas: 5, calibVencida: 1, costoMes: '$4.2M' }
  const datosFacturacion = { facturado: '$82M', facturas: 1247, glosas: 23, cartera: '$12M' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            {rol === 'director' ? 'Dashboard General' : rol === 'medico' ? 'Mi Dashboard' : rol === 'biomedico' ? 'Dashboard Biomédico' : 'Dashboard Facturación'}
          </h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace', textTransform: 'capitalize' }}>{hoy}</p>
        </div>
        <button style={{ padding: '8px 16px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          📥 Exportar
        </button>
      </div>

      {rol === 'director' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <KpiCard label="Citas hoy" value={datosDirector.citasHoy} delta="8% vs ayer" deltaType="up" icon="📅" color="#1D4ED8" barColor="linear-gradient(90deg,#1D4ED8,#3B82F6)" />
            <KpiCard label="Pacientes activos" value={datosDirector.pacientes.toLocaleString('es-CO')} delta="+23 este mes" deltaType="up" icon="👥" color="#16A34A" barColor="linear-gradient(90deg,#16A34A,#22C55E)" />
            <KpiCard label="Médicos activos" value={datosDirector.medicos} delta="6 especialidades" deltaType="neutral" icon="👨‍⚕️" color="#0D9488" barColor="linear-gradient(90deg,#0D9488,#14B8A6)" />
            <KpiCard label="Facturación mes" value={datosDirector.facturacion} delta="15% vs anterior" deltaType="up" icon="💰" color="#7C3AED" barColor="linear-gradient(90deg,#7C3AED,#A78BFA)" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <KpiCard label="Equipos operativos" value={`${datosDirector.equiposOp}/${datosDirector.equiposTotal}`} delta="4 en mantenimiento" deltaType="down" icon="🔬" color="#D97706" barColor="linear-gradient(90deg,#D97706,#F59E0B)" />
            <KpiCard label="En mantenimiento" value={datosDirector.equiposTotal - datosDirector.equiposOp} delta="Fuera de servicio" deltaType="down" icon="🔧" color="#DC2626" barColor="linear-gradient(90deg,#DC2626,#F87171)" />
            <KpiCard label="HC sin firmar" value={datosDirector.hcSinFirmar} delta="⚠️ Requiere atención" deltaType="down" icon="📋" color="#DC2626" barColor="linear-gradient(90deg,#DC2626,#F87171)" />
            <KpiCard label="RIPS pendiente" value={datosDirector.ripsPendiente} delta="Plazo: hoy" deltaType="down" icon="📤" color="#D97706" barColor="linear-gradient(90deg,#D97706,#F59E0B)" />
          </div>

          <DashboardCharts rol="director" />

          <MedicosTable />
        </>
      )}

      {rol === 'medico' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <KpiCard label="Mis citas hoy" value={datosMedico.misGitas} delta="Asignadas" deltaType="neutral" icon="📅" color="#1D4ED8" barColor="linear-gradient(90deg,#1D4ED8,#3B82F6)" />
          <KpiCard label="Completadas" value={datosMedico.completadas} delta="67% del día" deltaType="up" icon="✅" color="#16A34A" barColor="linear-gradient(90deg,#16A34A,#22C55E)" />
          <KpiCard label="Pendientes" value={datosMedico.pendientes} delta="Próxima en 15 min" deltaType="neutral" icon="⏳" color="#D97706" barColor="linear-gradient(90deg,#D97706,#F59E0B)" />
          <KpiCard label="HC sin firmar" value={datosMedico.hcSinFirmar} delta="⚠️ Urgente" deltaType="down" icon="📋" color="#DC2626" barColor="linear-gradient(90deg,#DC2626,#F87171)" />
        </div>
      )}

      {rol === 'biomedico' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <KpiCard label="Equipos operativos" value={`${datosBiomedico.equiposOp}/38`} delta="89.5% disponibilidad" deltaType="neutral" icon="🔬" color="#16A34A" barColor="linear-gradient(90deg,#16A34A,#22C55E)" />
          <KpiCard label="OTs abiertas" value={datosBiomedico.otsAbiertas} delta="2 críticas" deltaType="down" icon="🔧" color="#DC2626" barColor="linear-gradient(90deg,#DC2626,#F87171)" />
          <KpiCard label="Calibración vencida" value={datosBiomedico.calibVencida} delta="¡CRÍTICO!" deltaType="down" icon="⚠️" color="#DC2626" barColor="linear-gradient(90deg,#DC2626,#F87171)" />
          <KpiCard label="Costo mantto. mes" value={datosBiomedico.costoMes} delta="OPEX biomédico" deltaType="neutral" icon="💰" color="#1D4ED8" barColor="linear-gradient(90deg,#1D4ED8,#3B82F6)" />
        </div>
      )}

      {rol === 'facturacion' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <KpiCard label="Facturado mes" value={datosFacturacion.facturado} delta="15% vs anterior" deltaType="up" icon="💰" color="#16A34A" barColor="linear-gradient(90deg,#16A34A,#22C55E)" />
          <KpiCard label="Facturas emitidas" value={datosFacturacion.facturas.toLocaleString('es-CO')} delta="Mes actual" deltaType="neutral" icon="📄" color="#1D4ED8" barColor="linear-gradient(90deg,#1D4ED8,#3B82F6)" />
          <KpiCard label="Glosas activas" value={datosFacturacion.glosas} delta="$4.2M en disputa" deltaType="down" icon="⚖️" color="#D97706" barColor="linear-gradient(90deg,#D97706,#F59E0B)" />
          <KpiCard label="Cartera vencida" value={datosFacturacion.cartera} delta="+90 días" deltaType="down" icon="📂" color="#DC2626" barColor="linear-gradient(90deg,#DC2626,#F87171)" />
        </div>
      )}
    </div>
  )
}
