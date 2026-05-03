import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header session={session} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar rol={session.user.rol} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#F5F7FA' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
