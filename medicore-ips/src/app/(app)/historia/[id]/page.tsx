'use client'

import { useRouter } from 'next/navigation'

export default function HistoriaDetallePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', marginBottom: '6px' }}>Historia clínica no encontrada</h2>
      <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '4px' }}>ID: <span style={{ fontFamily: 'monospace' }}>{params.id}</span></p>
      <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '28px' }}>Conecta Oracle para acceder a las historias clínicas</p>
      <button onClick={() => router.push('/historia')}
        style={{ padding: '9px 20px', background: '#C74634', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
        ← Volver a historias clínicas
      </button>
    </div>
  )
}
