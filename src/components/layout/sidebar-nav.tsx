'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Brain
} from 'lucide-react'
import { CompanyHeader } from './company-header'

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: Shield, color: 'primary' },
  { title: 'API Discovery', href: '/api-discovery', icon: Search, color: 'blue' },
  { title: 'API Catalog', href: '/api-catalog', icon: Database, color: 'green' },
  { title: 'API Documentation', href: '/api-documentation', icon: FileText, color: 'purple' },
  { title: 'Threat Detection', href: '/threat-detection', icon: Activity, color: 'red' },
  { title: 'MCP Security', href: '/mcp-security', icon: Lock, color: 'orange' },
  { title: 'MCP Discovery', href: '/mcp-discovery', icon: Globe, color: 'teal' },
  { title: 'MCP Threats', href: '/mcp-threats', icon: Zap, color: 'yellow' },
  { title: 'AI Providers', href: '/ai-providers', icon: Brain, color: 'indigo' },
  { title: 'Security Policies', href: '/security-policies', icon: Settings, color: 'gray' },
  { title: 'Access Control', href: '/access-control', icon: Users, color: 'pink' }
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Logo and Company */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Aran</h1>
            <p className="text-xs text-gray-500">API Sentinel</p>
          </div>
        </div>
        
        {/* Company Context */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <CompanyHeader />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@aran.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
