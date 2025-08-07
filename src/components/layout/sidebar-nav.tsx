'use client'

import { css } from '../../../styled-system/css'
import { flex, stack } from '../../../styled-system/patterns'
import { 
  Shield, 
  Activity, 
  Database, 
  Users, 
  Settings, 
  Search,
  FileText,
  Zap,
  Globe,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Shield,
    color: 'primary'
  },
  {
    title: 'API Discovery',
    href: '/api-discovery',
    icon: Search,
    color: 'primary'
  },
  {
    title: 'Threat Detection',
    href: '/threat-detection',
    icon: Activity,
    color: 'warning'
  },
  {
    title: 'API Catalog',
    href: '/api-catalog',
    icon: Database,
    color: 'primary'
  },
  {
    title: 'API Documentation',
    href: '/api-documentation',
    icon: FileText,
    color: 'primary'
  },
  {
    title: 'MCP Security',
    href: '/mcp-security',
    icon: Zap,
    color: 'primary'
  },
  {
    title: 'MCP Discovery',
    href: '/mcp-discovery',
    icon: Globe,
    color: 'primary'
  },
  {
    title: 'MCP Threats',
    href: '/mcp-threats',
    icon: Lock,
    color: 'error'
  },
  {
    title: 'MCP Catalog',
    href: '/mcp-catalog',
    icon: Database,
    color: 'primary'
  },
  {
    title: 'Security Policies',
    href: '/security-policies',
    icon: Shield,
    color: 'primary'
  },
  {
    title: 'Access Control',
    href: '/access-control',
    icon: Users,
    color: 'primary'
  }
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className={css({
      w: '64',
      h: '100vh',
      bg: 'white',
      borderRight: '1px solid',
      borderColor: 'gray.200',
      py: '6',
      px: '4',
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '20'
    })}>
      {/* Logo */}
      <div className={css({ px: '4', mb: '8' })}>
        <div className={flex({ align: 'center', gap: '3' })}>
          <div className={css({
            w: '8',
            h: '8',
            bg: 'primary.500',
            borderRadius: 'lg',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 'sm'
          })}>
            A
          </div>
          <span className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.900' })}>
            Aran
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className={stack({ gap: '1' })}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '3',
                px: '4',
                py: '3',
                borderRadius: 'lg',
                fontSize: 'sm',
                fontWeight: 'medium',
                transition: 'all 0.2s',
                _hover: {
                  bg: isActive ? `${item.color}.100` : 'gray.50'
                },
                ...(isActive && {
                  bg: `${item.color}.50`,
                  color: `${item.color}.700`,
                  border: '1px solid',
                  borderColor: `${item.color}.200`
                }),
                ...(!isActive && {
                  color: 'gray.700'
                })
              })}
            >
              <Icon 
                size={18} 
                className={css({
                  color: isActive ? `${item.color}.600` : 'gray.500'
                })}
              />
              {item.title}
            </Link>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className={css({ 
        position: 'absolute', 
        bottom: '6', 
        left: '4', 
        right: '4' 
      })}>
        <div className={css({
          p: '4',
          borderRadius: 'lg',
          bg: 'gray.50',
          border: '1px solid',
          borderColor: 'gray.200'
        })}>
          <div className={flex({ align: 'center', gap: '3', mb: '2' })}>
            <div className={css({
              w: '8',
              h: '8',
              borderRadius: 'full',
              bg: 'success.500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'xs',
              fontWeight: 'bold'
            })}>
              A
            </div>
            <div>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.900' })}>
                Admin User
              </p>
              <p className={css({ fontSize: 'xs', color: 'gray.600' })}>
                admin@company.com
              </p>
            </div>
          </div>
          
          <Link
            href="/settings"
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              px: '3',
              py: '2',
              borderRadius: 'md',
              fontSize: 'xs',
              color: 'gray.600',
              _hover: { bg: 'gray.100' }
            })}
          >
            <Settings size={14} />
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}
