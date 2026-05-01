import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

const RUTAS_PROTEGIDAS = ['/dashboard', '/citas', '/historia', '/pacientes', '/biomedico', '/mantenimiento', '/inventario', '/facturacion', '/rips', '/auditoria', '/ia', '/prediccion', '/disponibilidad', '/ordenes', '/comportamiento', '/auditoria-bio']

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isProtegida = RUTAS_PROTEGIDAS.some(ruta => nextUrl.pathname.startsWith(ruta))
  if (isProtegida && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
