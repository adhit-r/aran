"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  Shield,
  Search,
  Activity,
  Database,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react'
import { pb } from '@/lib/pocketbase'

interface StatCard {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative'
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatCard[]>([])
  const [recentActivity, setRecentActivity] = useState<
    { id: string; title: string; description: string; time: string; status: 'success' | 'warning' | 'error' | 'info' }[]
  >([])

  useEffect(() => {
    const load = async () => {
      try {
        // Counts via lightweight list requests
        const [apisPage, appsPage, testsPage] = await Promise.all([
          pb.collection('api_endpoints').getList(1, 1),
          pb.collection('apps').getList(1, 1),
          pb.collection('api_tests').getList(1, 1),
        ])

        const totalApis = apisPage.totalItems || 0
        const totalApps = appsPage.totalItems || 0
        const totalTests = testsPage.totalItems || 0

        // Fetch some endpoints to compute avg response time
        const apisSample = await pb.collection('api_endpoints').getList(1, 50, { sort: '-updated' })
        const responseTimes = apisSample.items
          .map((r: any) => Number(r.responseTime) || 0)
          .filter((n: number) => Number.isFinite(n) && n >= 0)
        const avgResponse = responseTimes.length
          ? Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length)
          : 0

        // Fetch recent tests and compute pass ratio as security score
        const testsSample = await pb.collection('api_tests').getList(1, 50, { sort: '-lastRun' })
        const results = testsSample.items.map((t: any) => t.lastResult).filter(Boolean)
        const pass = results.filter((r: any) => r.success === true).length
        const fail = results.filter((r: any) => r.success === false).length
        const totalWithResult = pass + fail
        const securityScore = totalWithResult ? Math.round((pass / totalWithResult) * 100) : 0

        // Active threats approximated by failing tests in the window
        const activeThreats = fail

        const newStats: StatCard[] = [
          {
            title: 'Total APIs',
            value: totalApis.toLocaleString(),
            icon: Database,
            description: `${totalApps.toLocaleString()} apps onboarded`,
          },
          {
            title: 'Active Threats',
            value: activeThreats.toString(),
            icon: AlertTriangle,
            description: 'From recent failing test runs',
            changeType: activeThreats === 0 ? 'positive' : 'negative',
          },
          {
            title: 'Security Score',
            value: `${securityScore}%`,
            icon: Shield,
            description: `${totalWithResult} recent checks`,
            changeType: securityScore >= 90 ? 'positive' : 'negative',
          },
          {
            title: 'Avg Response Time',
            value: `${avgResponse}ms`,
            icon: Clock,
            description: 'Across latest endpoints',
          },
        ]

        // Recent activity from endpoints and tests
        const recentEndpoints = apisSample.items.slice(0, 10).map((e: any) => ({
          id: `ep_${e.id}`,
          title: 'Endpoint updated',
          description: `${e.method} ${e.path}`,
          time: new Date(e.updated || e.created).toLocaleString(),
          status: 'info' as const,
        }))

        const recentTests = testsSample.items.slice(0, 10).map((t: any) => ({
          id: `t_${t.id}`,
          title: t.lastResult?.success ? 'Test passed' : 'Test failed',
          description: `${t.method} ${t.url}`,
          time: t.lastRun ? new Date(t.lastRun).toLocaleString() : new Date(t.updated || t.created).toLocaleString(),
          status: t.lastResult?.success ? ('success' as const) : ('warning' as const),
        }))

        const combined = [...recentTests, ...recentEndpoints]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 10)

        setStats(newStats)
        setRecentActivity(combined)
      } catch (err) {
        setStats([
          { title: 'Total APIs', value: '0', icon: Database },
          { title: 'Active Threats', value: '0', icon: AlertTriangle },
          { title: 'Security Score', value: '0%', icon: Shield },
          { title: 'Avg Response Time', value: '0ms', icon: Clock },
        ])
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {loading ? 'Loading metrics…' : "Your organization's latest API metrics"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  {stat.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Icon className="w-8 h-8 text-primary-600" />
                  {stat.change && (
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest events across your APIs</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(activity.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Common tasks and shortcuts</p>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Plus className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Add New App</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Search className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Discover APIs</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Activity className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Run Security Scan</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FileText className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Performance</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recent response times</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Performance chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

    
