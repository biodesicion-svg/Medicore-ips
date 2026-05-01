import { Rol } from '@/types'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      rol: Rol
      nombre: string
    }
  }
  interface User {
    rol: Rol
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    rol: Rol
    nombre: string
  }
}
