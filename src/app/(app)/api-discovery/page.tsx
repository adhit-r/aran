
'use client'

import { css } from '../../../../styled-system/css'
import { flex, grid, stack, container } from '../../../../styled-system/patterns'
import { Search, Plus, Filter, Download, Eye, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface ApiEndpoint {
  id: string
  path: string
  method: string
  status: 'active' | 'inactive' | 'deprecated'
  security: 'secure' | 'insecure' | 'unknown'
  lastSeen: string
  traffic: number
  company: string
}

const mockEndpoints: ApiEndpoint[] = [
  {
    id: '1',
    path: '/api/users',
    method: 'GET',
    status: 'active',
    security: 'secure',
    lastSeen: '2 minutes ago',
    traffic: 1250,
    company: 'TechCorp'
  },
  {
    id: '2',
    path: '/api/users/{id}',
    method: 'GET',
    status: 'active',
    security: 'secure',
    lastSeen: '5 minutes ago',
    traffic: 890,
    company: 'TechCorp'
  },
  {
    id: '3',
    path: '/api/auth/login',
    method: 'POST',
    status: 'active',
    security: 'insecure',
    lastSeen: '1 minute ago',
    traffic: 2340,
    company: 'TechCorp'
  },
  {
    id: '4',
    path: '/api/products',
    method: 'GET',
    status: 'active',
    security: 'secure',
    lastSeen: '3 minutes ago',
    traffic: 1560,
    company: 'TechCorp'
  },
  {
    id: '5',
    path: '/api/orders',
    method: 'POST',
    status: 'active',
    security: 'unknown',
    lastSeen: '10 minutes ago',
    traffic: 670,
    company: 'TechCorp'
  }
]

export default function ApiDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedSecurity, setSelectedSecurity] = useState<string>('all')

  const filteredEndpoints = mockEndpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || endpoint.status === selectedStatus
    const matchesSecurity = selectedSecurity === 'all' || endpoint.security === selectedSecurity
    return matchesSearch && matchesStatus && matchesSecurity
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'gray'
      case 'deprecated': return 'warning'
      default: return 'gray'
    }
  }

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'secure': return 'success'
      case 'insecure': return 'error'
      case 'unknown': return 'warning'
      default: return 'gray'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success'
      case 'POST': return 'primary'
      case 'PUT': return 'warning'
      case 'DELETE': return 'error'
      default: return 'gray'
    }
  }

  return (
    <div className={css({ minH: '100vh', bg: 'gray.50' })}>
      {/* Header */}
      <header className={css({
        bg: 'white',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        px: '6',
        py: '4'
      })}>
        <div className={flex({ align: 'center', justify: 'between' })}>
          <div>
            <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900', mb: '1' })}>
              API Discovery
            </h1>
            <p className={css({ color: 'gray.600' })}>
              Automatically discover and monitor API endpoints
            </p>
          </div>
          
          <div className={flex({ align: 'center', gap: '3' })}>
            <button className={css({
              px: '4',
              py: '2',
              borderRadius: 'lg',
              bg: 'gray.100',
              color: 'gray.700',
              fontSize: 'sm',
              fontWeight: 'medium',
              _hover: { bg: 'gray.200' }
            })}>
              <div className={flex({ align: 'center', gap: '2' })}>
                <Download size={16} />
                Export
              </div>
            </button>
            
            <button className={css({
              px: '4',
              py: '2',
              borderRadius: 'lg',
              bg: 'primary.500',
              color: 'white',
              fontSize: 'sm',
              fontWeight: 'medium',
              _hover: { bg: 'primary.600' }
            })}>
              <div className={flex({ align: 'center', gap: '2' })}>
                <Plus size={16} />
                New Scan
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={container({ maxW: '7xl', mx: 'auto', px: '6', py: '8' })}>
        {/* Stats Cards */}
        <div className={grid({ columns: { base: 1, md: 4 }, gap: '6', mb: '8' })}>
          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', gap: '3', mb: '4' })}>
              <div className={css({
                w: '10',
                h: '10',
                borderRadius: 'lg',
                bg: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.600'
              })}>
                <Search size={20} />
              </div>
              <div>
                <p className={css({ fontSize: 'sm', color: 'gray.600' })}>Total Endpoints</p>
                <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
                  {mockEndpoints.length}
                </p>
              </div>
            </div>
          </div>

          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', gap: '3', mb: '4' })}>
              <div className={css({
                w: '10',
                h: '10',
                borderRadius: 'lg',
                bg: 'success.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'success.600'
              })}>
                <CheckCircle size={20} />
              </div>
              <div>
                <p className={css({ fontSize: 'sm', color: 'gray.600' })}>Secure</p>
                <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
                  {mockEndpoints.filter(e => e.security === 'secure').length}
                </p>
              </div>
            </div>
          </div>

          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', gap: '3', mb: '4' })}>
              <div className={css({
                w: '10',
                h: '10',
                borderRadius: 'lg',
                bg: 'error.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.600'
              })}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className={css({ fontSize: 'sm', color: 'gray.600' })}>Insecure</p>
                <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
                  {mockEndpoints.filter(e => e.security === 'insecure').length}
                </p>
              </div>
            </div>
          </div>

          <div className={css({
            bg: 'white',
            p: '6',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'gray.200',
            boxShadow: 'soft'
          })}>
            <div className={flex({ align: 'center', gap: '3', mb: '4' })}>
              <div className={css({
                w: '10',
                h: '10',
                borderRadius: 'lg',
                bg: 'warning.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'warning.600'
              })}>
                <Shield size={20} />
              </div>
              <div>
                <p className={css({ fontSize: 'sm', color: 'gray.600' })}>Unknown</p>
                <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
                  {mockEndpoints.filter(e => e.security === 'unknown').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={css({
          bg: 'white',
          p: '6',
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: 'gray.200',
          boxShadow: 'soft',
          mb: '6'
        })}>
          <div className={grid({ columns: { base: 1, md: 3 }, gap: '4' })}>
            <div className={css({ position: 'relative' })}>
              <Search className={css({ 
                position: 'absolute', 
                left: '3', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'gray.400',
                size: '20'
              })} />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={css({
                  w: 'full',
                  pl: '10',
                  pr: '4',
                  py: '2',
                  borderRadius: 'lg',
                  border: '1px solid',
                  borderColor: 'gray.300',
                  fontSize: 'sm',
                  _focus: {
                    outline: 'none',
                    borderColor: 'primary.500',
                    ring: '1px',
                    ringColor: 'primary.200'
                  }
                })}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={css({
                w: 'full',
                px: '4',
                py: '2',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'gray.300',
                fontSize: 'sm',
                bg: 'white',
                _focus: {
                  outline: 'none',
                  borderColor: 'primary.500',
                  ring: '1px',
                  ringColor: 'primary.200'
                }
              })}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deprecated">Deprecated</option>
            </select>

            <select
              value={selectedSecurity}
              onChange={(e) => setSelectedSecurity(e.target.value)}
              className={css({
                w: 'full',
                px: '4',
                py: '2',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'gray.300',
                fontSize: 'sm',
                bg: 'white',
                _focus: {
                  outline: 'none',
                  borderColor: 'primary.500',
                  ring: '1px',
                  ringColor: 'primary.200'
                }
              })}
            >
              <option value="all">All Security</option>
              <option value="secure">Secure</option>
              <option value="insecure">Insecure</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        {/* Endpoints Table */}
        <div className={css({
          bg: 'white',
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: 'gray.200',
          boxShadow: 'soft',
          overflow: 'hidden'
        })}>
          <div className={css({
            px: '6',
            py: '4',
            borderBottom: '1px solid',
            borderColor: 'gray.200',
            bg: 'gray.50'
          })}>
            <h2 className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.900' })}>
              Discovered Endpoints ({filteredEndpoints.length})
            </h2>
          </div>

          <div className={css({ overflowX: 'auto' })}>
            <table className={css({ w: 'full' })}>
              <thead className={css({ bg: 'gray.50' })}>
                <tr>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Endpoint
                  </th>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Method
                  </th>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Status
                  </th>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Security
                  </th>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Traffic
                  </th>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Last Seen
                  </th>
                  <th className={css({ px: '6', py: '3', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={css({ divideY: '1px solid', divideColor: 'gray.200' })}>
                {filteredEndpoints.map((endpoint) => (
                  <tr key={endpoint.id} className={css({ _hover: { bg: 'gray.50' } })}>
                    <td className={css({ px: '6', py: '4' })}>
                      <div>
                        <p className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.900' })}>
                          {endpoint.path}
                        </p>
                        <p className={css({ fontSize: 'xs', color: 'gray.500' })}>
                          {endpoint.company}
                        </p>
                      </div>
                    </td>
                    <td className={css({ px: '6', py: '4' })}>
                      <span className={css({
                        px: '2',
                        py: '1',
                        borderRadius: 'md',
                        fontSize: 'xs',
                        fontWeight: 'medium',
                        bg: `${getMethodColor(endpoint.method)}.50`,
                        color: `${getMethodColor(endpoint.method)}.700`
                      })}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className={css({ px: '6', py: '4' })}>
                      <span className={css({
                        px: '2',
                        py: '1',
                        borderRadius: 'md',
                        fontSize: 'xs',
                        fontWeight: 'medium',
                        bg: `${getStatusColor(endpoint.status)}.50`,
                        color: `${getStatusColor(endpoint.status)}.700`
                      })}>
                        {endpoint.status}
                      </span>
                    </td>
                    <td className={css({ px: '6', py: '4' })}>
                      <div className={flex({ align: 'center', gap: '2' })}>
                        {endpoint.security === 'secure' && <CheckCircle size={16} className={css({ color: 'success.500' })} />}
                        {endpoint.security === 'insecure' && <AlertTriangle size={16} className={css({ color: 'error.500' })} />}
                        {endpoint.security === 'unknown' && <Shield size={16} className={css({ color: 'warning.500' })} />}
                        <span className={css({
                          px: '2',
                          py: '1',
                          borderRadius: 'md',
                          fontSize: 'xs',
                          fontWeight: 'medium',
                          bg: `${getSecurityColor(endpoint.security)}.50`,
                          color: `${getSecurityColor(endpoint.security)}.700`
                        })}>
                          {endpoint.security}
                        </span>
                      </div>
                    </td>
                    <td className={css({ px: '6', py: '4' })}>
                      <span className={css({ fontSize: 'sm', color: 'gray.900' })}>
                        {endpoint.traffic.toLocaleString()}
                      </span>
                    </td>
                    <td className={css({ px: '6', py: '4' })}>
                      <span className={css({ fontSize: 'sm', color: 'gray.600' })}>
                        {endpoint.lastSeen}
                      </span>
                    </td>
                    <td className={css({ px: '6', py: '4' })}>
                      <button className={css({
                        p: '2',
                        borderRadius: 'md',
                        color: 'gray.600',
                        _hover: { bg: 'gray.100' }
                      })}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
