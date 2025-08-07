
import { SidebarNav } from "@/components/layout/sidebar-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-auto ml-64">
        {children}
      </main>
    </div>
  )
}

    
