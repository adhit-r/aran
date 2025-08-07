
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { css } from '../../../styled-system/css'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={css({ display: 'flex', minH: '100vh' })}>
      <SidebarNav />
      <main className={css({ 
        flex: '1', 
        ml: '64',
        bg: 'gray.50'
      })}>
        {children}
      </main>
    </div>
  )
}

    
