'use client'

import { useState } from 'react'

export default function PortalLogin() {
  const [documento, setDocumento] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!documento.trim()) { setError('Ingresa tu número de documento'); return }
    if (!password.trim()) { setError('Ingresa tu contraseña'); return }
    setLoading(true)
    setError('')

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const docLimpio = documento.replace(/\D/g, '').trim()

      const { data, error: err } = await sb
        .from('pacientes')
        .select('*')
        .eq('documento', docLimpio)
        .maybeSingle()

      if (err || !data) {
        setError('Documento no encontrado. Verifica tu número.')
        setLoading(false)
        return
      }

      const passEsperado = docLimpio.slice(0, 4)
      if (password !== passEsperado) {
        setError('Contraseña incorrecta. Son los primeros 4 dígitos de tu documento.')
        setLoading(false)
        return
      }

      localStorage.setItem('portal_paciente', JSON.stringify(data))
      window.location.href = '/portal/inicio'
    } catch (e) {
      setError('Error de conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 50%, #fef0ee 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF0', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '36px', height: '36px', background: '#C74634', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏥</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E' }}>Medi<span style={{ color: '#C74634' }}>Core</span> IPS</div>
          <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Portal del Paciente</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '52px', marginBottom: '12px' }}>👋</div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1A1A2E', marginBottom: '6px' }}>¡Bienvenido!</h1>
            <p style={{ fontSize: '14px', color: '#5F6B7A' }}>Accede a tus citas, historia clínica y más</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                Número de documento
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none' }}>🪪</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={documento}
                  onChange={e => setDocumento(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Ej: 100000001"
                  style={{ width: '100%', padding: '13px 13px 13px 44px', border: '1.5px solid #E8ECF0', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#C74634'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none' }}>🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Primeros 4 dígitos del documento"
                  style={{ width: '100%', padding: '13px 44px 13px 44px', border: '1.5px solid #E8ECF0', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', background: '#F5F7FA', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#C74634'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '5px' }}>
                💡 Tu contraseña son los primeros 4 dígitos de tu documento
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', marginBottom: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#9CA3AF' : '#C74634', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⏳ Verificando...' : '🔐 Ingresar al portal'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#9CA3AF', lineHeight: '1.8' }}>
            ¿Problemas para ingresar? Comunícate con recepción<br />
            🔒 Res. 3100/2019 · Ley 1581/2012 · ISO 27001
          </div>
        </div>
      </div>
    </div>
  )
}
