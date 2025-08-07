
'use client'

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
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'deprecated': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'secure': return 'bg-green-100 text-green-800'
      case 'insecure': return 'bg-red-100 text-red-800'
      case 'unknown': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800'
      case 'POST': return 'bg-green-100 text-green-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              API Discovery
            </h1>
            <p className="text-gray-600">
              Automatically discover and monitor API endpoints
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
              <div className="flex items-center gap-2">
                <Download size={16} />
                Export
              </div>
            </button>
            
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              <div className="flex items-center gap-2">
                <Plus size={16} />
                New Scan
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Search size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Endpoints</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockEndpoints.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Secure APIs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockEndpoints.filter(e => e.security === 'secure').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Insecure APIs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockEndpoints.filter(e => e.security === 'insecure').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Monitoring</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockEndpoints.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search API endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deprecated">Deprecated</option>
              </select>
              
              <select
                value={selectedSecurity}
                onChange={(e) => setSelectedSecurity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Security</option>
                <option value="secure">Secure</option>
                <option value="insecure">Insecure</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Endpoints Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Discovered Endpoints</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Traffic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEndpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{endpoint.path}</div>
                      <div className="text-sm text-gray-500">{endpoint.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(endpoint.status)}`}>
                        {endpoint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSecurityColor(endpoint.security)}`}>
                        {endpoint.security}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {endpoint.traffic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {endpoint.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle size={16} />
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
