"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Shield,
  Search,
  Database,
  FileText,
  Activity,
  Lock,
  Globe,
  Zap,
  Settings,
  Users,
  Brain,
  Plus,
  Play,
  Menu,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NAV_CATEGORIES, NAV_ITEMS, type NavItem } from "@/lib/constants"

const ICONS: Record<NavItem["icon"], React.ComponentType<{ className?: string }>> = {
  Shield,
  Plus,
  Search,
  Database,
  FileText,
  Play,
  Activity,
  Lock,
  Globe,
  Zap,
  Brain,
  Settings,
  Users,
}

export function SidebarNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const groupedNav = useMemo(() => {
    const groups = NAV_CATEGORIES.slice().sort((a, b) => a.order - b.order).map((cat) => ({
      key: cat.key,
      title: cat.title,
      items: NAV_ITEMS.filter((n) => n.category === cat.key).sort((a, b) => a.order - b.order),
    }))
    return groups.filter((g) => g.items.length > 0)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transform transition-transform duration-200 ease-in-out z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Aran</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">API Sentinel</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Grouped Navigation */}
        <nav className="p-4 space-y-6">
          {groupedNav.map((group) => (
            <div key={group.key}>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon]
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <span>{item.title}</span>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@aran.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  )
}
