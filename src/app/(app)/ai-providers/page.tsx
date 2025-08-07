'use client'

import { 
  Brain, Settings, Activity, TrendingUp, AlertTriangle, 
  CheckCircle, XCircle, Clock, Zap, Cpu
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface AIProvider {
  name: string
  status: 'enabled' | 'disabled'
  successRate: number
  avgResponseTime: number
  lastUsed: string
  priority: number
}

interface AnalysisLog {
  id: string
  provider: string
  type: string
  success: boolean
  processingTime: number
  timestamp: string
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      name: 'Ollama (Local)',
      status: 'enabled',
      successRate: 95,
      avgResponseTime: 1200,
      lastUsed: '2 minutes ago',
      priority: 1
    },
    {
      name: 'OpenAI',
      status: 'enabled',
      successRate: 98,
      avgResponseTime: 800,
      lastUsed: '5 minutes ago',
      priority: 2
    },
    {
      name: 'Gemini',
      status: 'enabled',
      successRate: 92,
      avgResponseTime: 1500,
      lastUsed: '10 minutes ago',
      priority: 3
    },
    {
      name: 'Anthropic',
      status: 'disabled',
      successRate: 89,
      avgResponseTime: 2000,
      lastUsed: '1 hour ago',
      priority: 4
    },
    {
      name: 'Rule-based',
      status: 'enabled',
      successRate: 100,
      avgResponseTime: 50,
      lastUsed: 'Just now',
      priority: 5
    }
  ])

  const [recentLogs, setRecentLogs] = useState<AnalysisLog[]>([
    {
      id: '1',
      provider: 'Ollama (Local)',
      type: 'API Anomaly',
      success: true,
      processingTime: 1200,
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      provider: 'OpenAI',
      type: 'MCP Threat',
      success: true,
      processingTime: 800,
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      provider: 'Gemini',
      type: 'Security Scan',
      success: false,
      processingTime: 1500,
      timestamp: '10 minutes ago'
    },
    {
      id: '4',
      provider: 'Rule-based',
      type: 'API Anomaly',
      success: true,
      processingTime: 50,
      timestamp: '15 minutes ago'
    }
  ])

  const toggleProvider = (providerName: string) => {
    setProviders(prev => 
      prev.map(p => 
        p.name === providerName 
          ? { ...p, status: p.status === 'enabled' ? 'disabled' : 'enabled' }
          : p
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Providers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor AI analysis providers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <Brain className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Providers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {providers.filter(p => p.status === 'enabled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100 text-success-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">1.2s</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-error-100 text-error-600">
                <Activity className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Provider Management */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Provider Management</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        provider.status === 'enabled' ? 'bg-success-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                        <p className="text-sm text-gray-500">
                          Priority: {provider.priority} • {provider.successRate}% success
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {provider.avgResponseTime}ms
                        </p>
                        <p className="text-xs text-gray-500">avg response</p>
                      </div>
                      <button
                        onClick={() => toggleProvider(provider.name)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          provider.status === 'enabled'
                            ? 'bg-success-100 text-success-700 hover:bg-success-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {provider.status === 'enabled' ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Analysis Logs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Analysis Logs</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.success ? 'bg-success-500' : 'bg-error-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.provider}</p>
                        <p className="text-xs text-gray-500">{log.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{log.processingTime}ms</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">98.5%</div>
                <div className="text-sm text-gray-500">Overall Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">1.2s</div>
                <div className="text-sm text-gray-500">Average Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">3.2k</div>
                <div className="text-sm text-gray-500">Analyses This Month</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
