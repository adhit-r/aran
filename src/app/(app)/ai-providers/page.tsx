'use client'

import { css } from '../../../../styled-system/css'
import { flex, grid, stack, container } from '../../../../styled-system/patterns'
import { 
  Brain, Settings, Activity, TrendingUp, AlertTriangle, 
  CheckCircle, XCircle, Clock, Zap, Database, BarChart3
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { aiRouter } from '@/lib/ai-router'

interface AIProvider {
  name: string
  enabled: boolean
  priority: number
  last_used?: string
  success_count: number
  error_count: number
  avg_response_time: number
}

interface AIAnalysisLog {
  id: string
  provider: string
  analysis_type: string
  processing_time: number
  success: boolean
  timestamp: string
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [logs, setLogs] = useState<AIAnalysisLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const providerStats = aiRouter.getProviderStats()
      const analysisHistory = aiRouter.getAnalysisHistory(20)
      
      setProviders(providerStats)
      setLogs(analysisHistory)
    } catch (error) {
      console.error('Error loading AI provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProvider = async (providerName: string, enabled: boolean) => {
    try {
      const provider = providers.find(p => p.name === providerName)
      if (provider) {
        aiRouter.addProvider({
          name: providerName as any,
          enabled,
          priority: provider.priority,
          timeout: 30000
        })
        await loadData()
      }
    } catch (error) {
      console.error('Error toggling provider:', error)
    }
  }

  const getProviderIcon = (name: string) => {
    switch (name) {
      case 'ollama': return <Brain className={css({ color: 'blue.500' })} />
      case 'openai': return <Zap className={css({ color: 'green.500' })} />
      case 'gemini': return <TrendingUp className={css({ color: 'purple.500' })} />
      case 'anthropic': return <Activity className={css({ color: 'orange.500' })} />
      case 'rule-based': return <Database className={css({ color: 'gray.500' })} />
      default: return <Settings />
    }
  }

  const getSuccessRate = (provider: AIProvider) => {
    const total = provider.success_count + provider.error_count
    return total > 0 ? (provider.success_count / total * 100).toFixed(1) : '0'
  }

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'green.500' : 'gray.400'
  }

  if (loading) {
    return (
      <div className={container({ maxW: '7xl', mx: 'auto', p: '6' })}>
        <div className={css({ textAlign: 'center', py: '20' })}>
          <div className={css({ fontSize: 'lg', color: 'gray.600' })}>
            Loading AI providers...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={container({ maxW: '7xl', mx: 'auto', p: '6' })}>
      {/* Header */}
      <div className={stack({ gap: '6', mb: '8' })}>
        <div className={flex({ alignItems: 'center', gap: '3' })}>
          <Brain className={css({ size: '8', color: 'primary.600' })} />
          <div>
            <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', color: 'gray.900' })}>
              AI Providers Management
            </h1>
            <p className={css({ color: 'gray.600', mt: '1' })}>
              Manage AI providers and monitor their performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={grid({ columns: [1, 2, 4], gap: '6', mb: '8' })}>
        <div className={css({ 
          bg: 'white', 
          p: '6', 
          rounded: 'lg', 
          border: '1px solid', 
          borderColor: 'gray.200',
          textAlign: 'center'
        })}>
          <div className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'primary.600' })}>
            {providers.filter(p => p.enabled).length}
          </div>
          <div className={css({ color: 'gray.600', fontSize: 'sm', mt: '1' })}>
            Active Providers
          </div>
        </div>

        <div className={css({ 
          bg: 'white', 
          p: '6', 
          rounded: 'lg', 
          border: '1px solid', 
          borderColor: 'gray.200',
          textAlign: 'center'
        })}>
          <div className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'green.600' })}>
            {logs.filter(l => l.success).length}
          </div>
          <div className={css({ color: 'gray.600', fontSize: 'sm', mt: '1' })}>
            Successful Analyses
          </div>
        </div>

        <div className={css({ 
          bg: 'white', 
          p: '6', 
          rounded: 'lg', 
          border: '1px solid', 
          borderColor: 'gray.200',
          textAlign: 'center'
        })}>
          <div className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'orange.600' })}>
            {logs.length}
          </div>
          <div className={css({ color: 'gray.600', fontSize: 'sm', mt: '1' })}>
            Total Analyses
          </div>
        </div>

        <div className={css({ 
          bg: 'white', 
          p: '6', 
          rounded: 'lg', 
          border: '1px solid', 
          borderColor: 'gray.200',
          textAlign: 'center'
        })}>
          <div className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'blue.600' })}>
            {providers.reduce((acc, p) => acc + p.avg_response_time, 0) / providers.length || 0}
          </div>
          <div className={css({ color: 'gray.600', fontSize: 'sm', mt: '1' })}>
            Avg Response (ms)
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className={grid({ columns: [1, 2], gap: '6', mb: '8' })}>
        {providers.map((provider) => (
          <div key={provider.name} className={css({ 
            bg: 'white', 
            p: '6', 
            rounded: 'lg', 
            border: '1px solid', 
            borderColor: 'gray.200',
            cursor: 'pointer',
            transition: 'all 0.2s',
            _hover: { shadow: 'md', transform: 'translateY(-1px)' }
          })} onClick={() => setSelectedProvider(provider.name)}>
            <div className={flex({ alignItems: 'center', justifyContent: 'space-between', mb: '4' })}>
              <div className={flex({ alignItems: 'center', gap: '3' })}>
                {getProviderIcon(provider.name)}
                <div>
                  <h3 className={css({ fontSize: 'lg', fontWeight: 'semibold', color: 'gray.900' })}>
                    {provider.name.toUpperCase()}
                  </h3>
                  <p className={css({ color: 'gray.600', fontSize: 'sm' })}>
                    Priority: {provider.priority}
                  </p>
                </div>
              </div>
              <div className={flex({ alignItems: 'center', gap: '2' })}>
                {provider.enabled ? (
                  <CheckCircle className={css({ size: '5', color: 'green.500' })} />
                ) : (
                  <XCircle className={css({ size: '5', color: 'gray.400' })} />
                )}
              </div>
            </div>

            <div className={grid({ columns: [1, 2], gap: '4', mb: '4' })}>
              <div className={css({ textAlign: 'center' })}>
                <div className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'green.600' })}>
                  {getSuccessRate(provider)}%
                </div>
                <div className={css({ color: 'gray.600', fontSize: 'xs' })}>
                  Success Rate
                </div>
              </div>
              <div className={css({ textAlign: 'center' })}>
                <div className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'blue.600' })}>
                  {provider.avg_response_time.toFixed(0)}ms
                </div>
                <div className={css({ color: 'gray.600', fontSize: 'xs' })}>
                  Avg Response
                </div>
              </div>
            </div>

            <div className={flex({ gap: '2' })}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleProvider(provider.name, !provider.enabled)
                }}
                className={css({
                  flex: '1',
                  px: '3',
                  py: '2',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  rounded: 'md',
                  border: '1px solid',
                  borderColor: provider.enabled ? 'red.300' : 'green.300',
                  color: provider.enabled ? 'red.600' : 'green.600',
                  bg: provider.enabled ? 'red.50' : 'green.50',
                  _hover: {
                    bg: provider.enabled ? 'red.100' : 'green.100'
                  }
                })}
              >
                {provider.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Analysis Logs */}
      <div className={css({ bg: 'white', rounded: 'lg', border: '1px solid', borderColor: 'gray.200' })}>
        <div className={css({ p: '6', borderBottom: '1px solid', borderColor: 'gray.200' })}>
          <h2 className={css({ fontSize: 'xl', fontWeight: 'semibold', color: 'gray.900' })}>
            Recent Analysis Logs
          </h2>
        </div>
        <div className={css({ overflow: 'hidden' })}>
          <table className={css({ w: 'full' })}>
            <thead className={css({ bg: 'gray.50' })}>
              <tr>
                <th className={css({ p: '4', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                  Provider
                </th>
                <th className={css({ p: '4', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                  Type
                </th>
                <th className={css({ p: '4', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                  Status
                </th>
                <th className={css({ p: '4', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                  Time
                </th>
                <th className={css({ p: '4', textAlign: 'left', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700' })}>
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className={css({ borderBottom: '1px solid', borderColor: 'gray.100' })}>
                  <td className={css({ p: '4', fontSize: 'sm', color: 'gray.900' })}>
                    <div className={flex({ alignItems: 'center', gap: '2' })}>
                      {getProviderIcon(log.provider)}
                      {log.provider}
                    </div>
                  </td>
                  <td className={css({ p: '4', fontSize: 'sm', color: 'gray.600' })}>
                    {log.analysis_type}
                  </td>
                  <td className={css({ p: '4' })}>
                    {log.success ? (
                      <div className={flex({ alignItems: 'center', gap: '1' })}>
                        <CheckCircle className={css({ size: '4', color: 'green.500' })} />
                        <span className={css({ fontSize: 'sm', color: 'green.600' })}>Success</span>
                      </div>
                    ) : (
                      <div className={flex({ alignItems: 'center', gap: '1' })}>
                        <XCircle className={css({ size: '4', color: 'red.500' })} />
                        <span className={css({ fontSize: 'sm', color: 'red.600' })}>Failed</span>
                      </div>
                    )}
                  </td>
                  <td className={css({ p: '4', fontSize: 'sm', color: 'gray.600' })}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className={css({ p: '4', fontSize: 'sm', color: 'gray.600' })}>
                    {log.processing_time}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
