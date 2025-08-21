'use client'

import { useEffect, useState } from 'react'
import { pb, getCurrentCompany } from '@/lib/pocketbase'
import { Shield, Lock, Key, Clock } from 'lucide-react'

export default function ApiSecurityPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<{ totalApis: number; missingAuth: number; weakAuth: number; rateLimited: number }>({
    totalApis: 0,
    missingAuth: 0,
    weakAuth: 0,
    rateLimited: 0,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const company = getCurrentCompany()
        const opts = company ? { filter: `appId.companyId = "${company}"` } : {}
        const endpoints = await pb.collection('api_endpoints').getList(1, 500, { sort: '-updated', ...opts })
        const items = endpoints.items as any[]

        const totalApis = endpoints.totalItems || items.length
        const missingAuth = items.filter((e) => (e.authentication || 'none') === 'none').length
        const weakAuth = items.filter((e) => ['api_key'].includes(e.authentication)).length
        const rateLimited = items.filter((e) => Number(e.rateLimit) > 0).length

        setSummary({ totalApis, missingAuth, weakAuth, rateLimited })
      } catch (e: any) {
        setError(e?.message || 'Failed to load security posture')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Security</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Authentication, authorization and rate limiting posture</p>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total APIs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalApis}</p>
              </div>
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Missing Auth</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.missingAuth}</p>
              </div>
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weak Auth (API Key)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.weakAuth}</p>
              </div>
              <Key className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limited</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.rateLimited}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
