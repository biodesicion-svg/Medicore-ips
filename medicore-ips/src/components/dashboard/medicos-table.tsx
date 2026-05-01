'use client'

const MEDICOS = [
  { nombre: 'Dr. Torres', especialidad: 'Med. General', total: 12, atendidas: 8, estado: 'En consulta' },
  { nombre: 'Dr. Suárez', especialidad: 'Cardiología', total: 8, atendidas: 5, estado: 'En consulta' },
  { nombre: 'Dra. López', especialidad: 'Pediatría', total: 10, atendidas: 7, estado: 'Almuerzo' },
  { nombre: 'Dr. Castillo', especialidad: 'Ortopedia', total: 6, atendidas: 4, estado: 'Disponible' },
  { nombre: 'Dra. Vargas', especialidad: 'Ginecología', total: 9, atendidas: 6, estado: 'En consulta' },
]

export default function MedicosTable() {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #E8ECF0', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginTop: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8ECF0' }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>👨‍⚕️ Médicos activos hoy</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F5F7FA' }}>
            {['Médico', 'Especialidad', 'Citas hoy', 'Atendidas', 'Estado'].map(h => (
              <th key={h} style={{ padding: '10px 16px', fontSize: '10px', fontWeight: '700', color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEDICOS.map((m, i) => (
            <tr
              key={i}
              style={{ borderBottom: '1px solid #E8ECF0' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{m.nombre}</td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: '#EFF6FF', color: '#1D4ED8' }}>{m.especialidad}</span>
              </td>
              <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: '13px', fontWeight: '700' }}>{m.total}</td>
              <td style={{ padding: '11px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '60px', height: '6px', background: '#E8ECF0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(m.atendidas / m.total * 100)}%`, height: '100%', background: '#16A34A', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>{m.atendidas}/{m.total}</span>
                </div>
              </td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px',
                  background: m.estado === 'En consulta' ? '#F0FDF4' : m.estado === 'Disponible' ? '#EFF6FF' : '#FFFBEB',
                  color: m.estado === 'En consulta' ? '#16A34A' : m.estado === 'Disponible' ? '#1D4ED8' : '#D97706',
                }}>
                  {m.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
