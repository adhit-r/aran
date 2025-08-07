'use client'

import { css } from '../../../styled-system/css'
import { flex, stack } from '../../../styled-system/patterns'
import {
  Shield, Activity, Database, Users, Settings, Search,
  FileText, Zap, Globe, Lock, Brain
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    <nav className={css({
      position: 'fixed',
      left: '0',
      top: '0',
      bottom: '0',
      width: '64',
      bg: 'white',
      borderRight: '1px solid',
      borderColor: 'gray.200',
      zIndex: '50',
      overflowY: 'auto'
    })}>
      {/* Logo */}
      <div className={css({
        p: '6',
        borderBottom: '1px solid',
        borderColor: 'gray.200'
      })}>
        <div className={flex({ alignItems: 'center', gap: '2' })}>
          <Shield className={css({ size: '6', color: 'primary.600' })} />
          <span className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.900' })}>
            Aran
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className={stack({ gap: '1', p: '4' })}>
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
                px: '3',
                py: '2',
                fontSize: 'sm',
                fontWeight: 'medium',
                rounded: 'md',
                transition: 'all 0.2s',
                color: isActive ? `${item.color}.700` : 'gray.600',
                bg: isActive ? `${item.color}.50` : 'transparent',
                _hover: {
                  bg: isActive ? `${item.color}.100` : 'gray.50',
                  color: isActive ? `${item.color}.800` : 'gray.700'
                }
              })}
            >
              <Icon 
                size={18} 
                className={css({ color: isActive ? `${item.color}.600` : 'gray.500' })} 
              />
              {item.title}
            </Link>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className={css({
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        p: '4',
        borderTop: '1px solid',
        borderColor: 'gray.200',
        bg: 'white'
      })}>
        <div className={flex({ alignItems: 'center', gap: '3', mb: '3' })}>
          <div className={css({
            width: '8',
            height: '8',
            rounded: 'full',
            bg: 'primary.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}>
            <Users className={css({ size: '4', color: 'primary.600' })} />
          </div>
          <div className={css({ flex: '1', minW: '0' })}>
            <div className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.900' })}>
              Admin User
            </div>
            <div className={css({ fontSize: 'xs', color: 'gray.500' })}>
              admin@company.com
            </div>
          </div>
        </div>
        
        <div className={flex({ gap: '1' })}>
          <button className={css({
            flex: '1',
            px: '2',
            py: '1',
            fontSize: 'xs',
            fontWeight: 'medium',
            rounded: 'sm',
            bg: 'gray.100',
            color: 'gray.700',
            _hover: { bg: 'gray.200' }
          })}>
            Profile
          </button>
          <button className={css({
            flex: '1',
            px: '2',
            py: '1',
            fontSize: 'xs',
            fontWeight: 'medium',
            rounded: 'sm',
            bg: 'gray.100',
            color: 'gray.700',
            _hover: { bg: 'gray.200' }
          })}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
