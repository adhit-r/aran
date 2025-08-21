'use client'

import { useEffect, useState } from 'react'
import { pb, getCurrentCompany } from '@/lib/pocketbase'
import { FileText, Settings, Users } from 'lucide-react'

export default function ApiGovernancePage() {
  const [loading, setLoading] = useState(true)
  const [coverage, setCoverage] = useState<{ total: number; docs: number; owners: number; compliant: number }>({
    total: 0,
    docs: 0,
    owners: 0,
    compliant: 0,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const company = getCurrentCompany()
        const opts = company ? { filter: `appId.companyId = "${company}"` } : {}
        const endpoints = await pb.collection('api_endpoints').getList(1, 500, { sort: '-updated', ...opts })
        const items = endpoints.items as any[]

        const total = endpoints.totalItems || items.length
        const docs = items.filter((e) => e.documentation && e.documentation.summary).length
        const owners = items.filter((e) => !!e.createdBy).length
        const compliant = items.filter((e) => e.status !== 'deprecated').length

        setCoverage({ total, docs, owners, compliant })
      } catch (e: any) {
        setError(e?.message || 'Failed to load governance data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Governance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Ownership, lifecycle and standards coverage</p>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Endpoints</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{coverage.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Docs Coverage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pct(coverage.docs, coverage.total)}%</p>
              </div>
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ownership Set</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pct(coverage.owners, coverage.total)}%</p>
              </div>
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliant (not deprecated)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pct(coverage.compliant, coverage.total)}%</p>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
