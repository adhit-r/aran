'use client'

import { css } from '../../../../styled-system/css'
import { flex, grid, container } from '../../../../styled-system/patterns'
import { Shield, Activity, Database, Users, Settings, Bell, Search, Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className={css({ minH: '100vh', bg: 'gray.50' })}>
      {/* Header */}
      <header className={css({
        bg: 'white',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        px: '6',
        py: '4',
        position: 'sticky',
        top: '0',
        zIndex: '10'
      })}>
        <div className={flex({ align: 'center', justify: 'between' })}>
          <div className={flex({ align: 'center', gap: '4' })}>
            <div className={css({
              w: '10',
              h: '10',
              bg: 'primary.500',
              borderRadius: 'lg',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 'lg'
            })}>
              A
            </div>
            <div>
              <h1 className={css({ fontSize: 'xl', fontWeight: 'bold', color: 'gray.900' })}>
                Aran API Sentinel
              </h1>
              <p className={css({ fontSize: 'sm', color: 'gray.600' })}>
                Multi-tenant API Security Platform
              </p>
            </div>
          </div>
          
          <div className={flex({ align: 'center', gap: '4' })}>
            <button className={css({
              p: '2',
              borderRadius: 'md',
              color: 'gray.600',
              _hover: { bg: 'gray.100' }
            })}>
              <Search size={20} />
            </button>
            <button className={css({
              p: '2',
              borderRadius: 'md',
              color: 'gray.600',
              _hover: { bg: 'gray.100' }
            })}>
              <Bell size={20} />
            </button>
            <div className={css({
              w: '8',
              h: '8',
              borderRadius: 'full',
              bg: 'primary.500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'sm',
              fontWeight: 'bold'
            })}>
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={container({ maxW: '7xl', mx: 'auto', px: '6', py: '8' })}>
        {/* Stats Grid */}
        <div className={grid({ columns: [1, 2, 4], gap: '6', mb: '8' })}>
          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', justify: 'between', mb: '4' })}>
              <div className={css({
                w: '12',
                h: '12',
                borderRadius: 'lg',
                bg: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.600'
              })}>
                <Shield size={24} />
              </div>
              <div className={css({
                px: '2',
                py: '1',
                borderRadius: 'full',
                bg: 'success.50',
                color: 'success.700',
                fontSize: 'xs',
                fontWeight: 'medium'
              })}>
                +12%
              </div>
            </div>
            <h3 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900', mb: '1' })}>
              1,234
            </h3>
            <p className={css({ color: 'gray.600', fontSize: 'sm' })}>
              APIs Secured
            </p>
          </div>

          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', justify: 'between', mb: '4' })}>
              <div className={css({
                w: '12',
                h: '12',
                borderRadius: 'lg',
                bg: 'warning.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'warning.600'
              })}>
                <Activity size={24} />
              </div>
              <div className={css({
                px: '2',
                py: '1',
                borderRadius: 'full',
                bg: 'error.50',
                color: 'error.700',
                fontSize: 'xs',
                fontWeight: 'medium'
              })}>
                +5
              </div>
            </div>
            <h3 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900', mb: '1' })}>
              89
            </h3>
            <p className={css({ color: 'gray.600', fontSize: 'sm' })}>
              Threats Detected
            </p>
          </div>

          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', justify: 'between', mb: '4' })}>
              <div className={css({
                w: '12',
                h: '12',
                borderRadius: 'lg',
                bg: 'success.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'success.600'
              })}>
                <Database size={24} />
              </div>
              <div className={css({
                px: '2',
                py: '1',
                borderRadius: 'full',
                bg: 'success.50',
                color: 'success.700',
                fontSize: 'xs',
                fontWeight: 'medium'
              })}>
                +8%
              </div>
            </div>
            <h3 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900', mb: '1' })}>
              99.9%
            </h3>
            <p className={css({ color: 'gray.600', fontSize: 'sm' })}>
              Uptime
            </p>
          </div>

          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', justify: 'between', mb: '4' })}>
              <div className={css({
                w: '12',
                h: '12',
                borderRadius: 'lg',
                bg: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.600'
              })}>
                <Users size={24} />
              </div>
              <div className={css({
                px: '2',
                py: '1',
                borderRadius: 'full',
                bg: 'primary.50',
                color: 'primary.700',
                fontSize: 'xs',
                fontWeight: 'medium'
              })}>
                +15%
              </div>
            </div>
            <h3 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900', mb: '1' })}>
              456
            </h3>
            <p className={css({ color: 'gray.600', fontSize: 'sm' })}>
              Active Users
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className={grid({ columns: [1, 2, 3], gap: '8' })}>
          {/* Recent Activity */}
          <div className={css({ 
            gridColumn: ['span 1', 'span 2', 'span 2']
          })}>
            <div className={css({
              bg: 'white',
              p: '6',
              borderRadius: 'xl',
              border: '1px solid',
              borderColor: 'gray.200',
              boxShadow: 'soft'
            })}>
              <div className={flex({ align: 'center', justify: 'between', mb: '6' })}>
                <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', color: 'gray.900' })}>
                  Recent Activity
                </h2>
                <button className={css({
                  px: '4',
                  py: '2',
                  borderRadius: 'md',
                  bg: 'primary.500',
                  color: 'white',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  _hover: { bg: 'primary.600' }
                })}>
                  View All
                </button>
              </div>
              
              <div className={css({ spaceY: '4' })}>
                {[
                  { icon: Shield, color: 'success', text: 'API endpoint secured', time: '2 min ago' },
                  { icon: Activity, color: 'warning', text: 'Threat detected in /api/users', time: '5 min ago' },
                  { icon: Database, color: 'primary', text: 'New API discovered', time: '12 min ago' },
                  { icon: Users, color: 'primary', text: 'User login from new device', time: '15 min ago' },
                  { icon: Settings, color: 'gray', text: 'Security policy updated', time: '1 hour ago' }
                ].map((item, index) => (
                  <div key={index} className={flex({ align: 'center', gap: '3' })}>
                    <div className={css({
                      w: '8',
                      h: '8',
                      borderRadius: 'md',
                      bg: `${item.color}.50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: `${item.color}.600`
                    })}>
                      <item.icon size={16} />
                    </div>
                    <div className={css({ flex: '1' })}>
                      <p className={css({ color: 'gray.900', fontSize: 'sm', fontWeight: 'medium' })}>
                        {item.text}
                      </p>
                      <p className={css({ color: 'gray.500', fontSize: 'xs' })}>
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className={css({
              bg: 'white',
              p: '6',
              borderRadius: 'xl',
              border: '1px solid',
              borderColor: 'gray.200',
              boxShadow: 'soft'
            })}>
              <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', color: 'gray.900', mb: '6' })}>
                Quick Actions
              </h2>
              
              <div className={css({ spaceY: '3' })}>
                <button className={css({
                  w: 'full',
                  p: '4',
                  borderRadius: 'lg',
                  bg: 'primary.50',
                  color: 'primary.700',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  border: '1px solid',
                  borderColor: 'primary.200',
                  _hover: { bg: 'primary.100' }
                })}>
                  <div className={flex({ align: 'center', gap: '3' })}>
                    <Plus size={16} />
                    Add New API
                  </div>
                </button>
                
                <button className={css({
                  w: 'full',
                  p: '4',
                  borderRadius: 'lg',
                  bg: 'gray.50',
                  color: 'gray.700',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  border: '1px solid',
                  borderColor: 'gray.200',
                  _hover: { bg: 'gray.100' }
                })}>
                  <div className={flex({ align: 'center', gap: '3' })}>
                    <Shield size={16} />
                    Security Scan
                  </div>
                </button>
                
                <button className={css({
                  w: 'full',
                  p: '4',
                  borderRadius: 'lg',
                  bg: 'gray.50',
                  color: 'gray.700',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  border: '1px solid',
                  borderColor: 'gray.200',
                  _hover: { bg: 'gray.100' }
                })}>
                  <div className={flex({ align: 'center', gap: '3' })}>
                    <Users size={16} />
                    Manage Users
                  </div>
                </button>
                
                <button className={css({
                  w: 'full',
                  p: '4',
                  borderRadius: 'lg',
                  bg: 'gray.50',
                  color: 'gray.700',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  border: '1px solid',
                  borderColor: 'gray.200',
                  _hover: { bg: 'gray.100' }
                })}>
                  <div className={flex({ align: 'center', gap: '3' })}>
                    <Settings size={16} />
                    Settings
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className={css({ mt: '8' })}>
          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', color: 'gray.900', mb: '6' })}>
              Security Overview
            </h2>
            
            <div className={grid({ columns: [1, 3], gap: '6' })}>
              <div className={css({
                p: '4',
                borderRadius: 'lg',
                bg: 'success.50',
                border: '1px solid',
                borderColor: 'success.200'
              })}>
                <div className={flex({ align: 'center', gap: '3', mb: '2' })}>
                  <div className={css({
                    w: '6',
                    h: '6',
                    borderRadius: 'full',
                    bg: 'success.500'
                  })} />
                  <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'success.700' })}>
                    Low Risk
                  </span>
                </div>
                <p className={css({ fontSize: 'xs', color: 'success.600' })}>
                  89% of APIs are properly secured
                </p>
              </div>
              
              <div className={css({
                p: '4',
                borderRadius: 'lg',
                bg: 'warning.50',
                border: '1px solid',
                borderColor: 'warning.200'
              })}>
                <div className={flex({ align: 'center', gap: '3', mb: '2' })}>
                  <div className={css({
                    w: '6',
                    h: '6',
                    borderRadius: 'full',
                    bg: 'warning.500'
                  })} />
                  <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'warning.700' })}>
                    Medium Risk
                  </span>
                </div>
                <p className={css({ fontSize: 'xs', color: 'warning.600' })}>
                  11% of APIs need attention
                </p>
              </div>
              
              <div className={css({
                p: '4',
                borderRadius: 'lg',
                bg: 'error.50',
                border: '1px solid',
                borderColor: 'error.200'
              })}>
                <div className={flex({ align: 'center', gap: '3', mb: '2' })}>
                  <div className={css({
                    w: '6',
                    h: '6',
                    borderRadius: 'full',
                    bg: 'error.500'
                  })} />
                  <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'error.700' })}>
                    High Risk
                  </span>
                </div>
                <p className={css({ fontSize: 'xs', color: 'error.600' })}>
                  5 APIs require immediate action
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

    
