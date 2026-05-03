'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F7FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            background: '#FFF5F3',
            borderRadius: '14px',
            border: '1.5px solid #ffd5cc',
            marginBottom: '16px',
            fontSize: '28px',
          }}>
            🏥
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', letterSpacing: '-0.8px', lineHeight: 1 }}>
            Medi<span style={{ color: '#C74634' }}>Core</span>{' '}
            <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '20px' }}>IPS</span>
          </div>
          <div style={{ fontSize: '13px', color: '#5F6B7A', marginTop: '6px' }}>
            Sistema de Gestión Integral
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E8ECF0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          padding: '32px',
        }}>
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#5F6B7A',
                marginBottom: '6px',
                letterSpacing: '0.3px',
              }}>
                Usuario
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@medicore.com.co"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid #E8ECF0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1A1A2E',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#C74634' }}
                onBlur={(e) => { e.target.style.borderColor = '#E8ECF0' }}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#5F6B7A',
                marginBottom: '6px',
                letterSpacing: '0.3px',
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 12px',
                    border: '1.5px solid #E8ECF0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1A1A2E',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#C74634' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8ECF0' }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    fontSize: '15px',
                    lineHeight: 1,
                    padding: '2px',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #fecaca',
                borderRadius: '7px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#DC2626',
                marginBottom: '16px',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                background: loading ? '#9CA3AF' : '#C74634',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.2px',
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>
          v1.0 · Oracle Cloud · ISO 27001
        </div>
      </div>
    </div>
  )
}
