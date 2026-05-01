import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PERFILES } from '@/lib/constants'
import { Rol } from '@/types'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null
        const perfil = PERFILES.find(p => p.email === email && p.password === password)
        if (!perfil) return null
        return {
          id: perfil.id,
          name: perfil.nombre,
          email: perfil.email,
          rol: perfil.rol,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as { rol: Rol }).rol
        token.nombre = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.rol = token.rol as Rol
        session.user.nombre = token.nombre as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})
