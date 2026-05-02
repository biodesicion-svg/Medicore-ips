import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

const RUTAS_PROTEGIDAS = ['/dashboard', '/citas', '/historia', '/pacientes', '/biomedico', '/mantenimiento', '/inventario', '/facturacion', '/rips', '/auditoria', '/ia', '/prediccion', '/disponibilidad', '/ordenes', '/comportamiento', '/auditoria-bio']

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname

  // Excluir completamente el portal del paciente
  if (pathname.startsWith('/portal')) {
    return NextResponse.next()
  }

  // Excluir login y api
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Proteger rutas del sistema
  const isProtegida = RUTAS_PROTEGIDAS.some(ruta => pathname.startsWith(ruta))
  if (isProtegida && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
