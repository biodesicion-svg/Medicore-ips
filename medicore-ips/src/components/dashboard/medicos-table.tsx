'use client'

const medicos = [
  { nombre: 'Dr. Torres',   esp: 'Med. General', total: 12, atendidas: 8,  estado: 'En consulta' },
  { nombre: 'Dr. Suárez',   esp: 'Cardiología',  total: 8,  atendidas: 5,  estado: 'En consulta' },
  { nombre: 'Dra. López',   esp: 'Pediatría',    total: 10, atendidas: 7,  estado: 'Almuerzo'   },
  { nombre: 'Dr. Castillo', esp: 'Ortopedia',    total: 6,  atendidas: 4,  estado: 'Disponible' },
  { nombre: 'Dra. Vargas',  esp: 'Ginecología',  total: 9,  atendidas: 6,  estado: 'En consulta' },
]

const estadoConfig: Record<string, { bg: string; color: string; dot: string }> = {
  'En consulta': { bg: 'var(--success-light)', color: 'var(--success)', dot: 'var(--success)' },
  'Disponible':  { bg: 'var(--primary-light)', color: 'var(--primary)', dot: 'var(--primary)' },
  'Almuerzo':    { bg: 'var(--warning-light)', color: 'var(--warning)', dot: 'var(--warning)' },
}

export default function MedicosTable() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Médicos activos hoy
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '1px' }}>
            {medicos.length} profesionales en turno
          </div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: '600',
          padding: '3px 10px', borderRadius: 'var(--radius-full)',
          background: 'var(--success-light)', color: 'var(--success)',
        }}>
          {medicos.filter(m => m.estado === 'En consulta').length} en consulta
        </span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--slate-50)' }}>
            {['Profesional', 'Especialidad', 'Citas', 'Progreso', 'Estado'].map(h => (
              <th key={h} style={{
                padding: '10px 20px',
                fontSize: '11px', fontWeight: '600',
                color: 'var(--text-tertiary)',
                textAlign: 'left',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                borderBottom: '1px solid var(--border)',
                fontFamily: 'monospace',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {medicos.map((m, i) => {
            const pct = Math.round((m.atendidas / m.total) * 100)
            const ec = estadoConfig[m.estado] || estadoConfig['Disponible']
            return (
              <tr key={i}
                style={{ borderBottom: i < medicos.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '13px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0,
                    }}>
                      {m.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {m.nombre}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '500',
                    padding: '3px 8px', borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                  }}>
                    {m.esp}
                  </span>
                </td>
                <td style={{ padding: '13px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {m.atendidas}/{m.total}
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '80px', height: '5px', background: 'var(--slate-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct >= 70 ? 'var(--success)' : 'var(--primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace', minWidth: '28px' }}>{pct}%</span>
                  </div>
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: ec.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: ec.color }}>{m.estado}</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
