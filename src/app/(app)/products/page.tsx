'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { pb, getCurrentCompany } from '@/lib/pocketbase'
import { Plus, Globe, Settings } from 'lucide-react'

interface AppRecord {
  id: string
  name: string
  description?: string
  domain: string
  environment: string
  status: string
  created: string
  updated: string
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [apps, setApps] = useState<AppRecord[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const company = getCurrentCompany()
        const list = await pb.collection('apps').getList(1, 100, {
          sort: '-updated',
          ...(company ? { filter: `companyId = "${company}"` } : {}),
        })
        setApps(list.items as unknown as AppRecord[])
      } catch (e: any) {
        setError(e?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Applications onboarded in your organization</p>
        </div>
        <Link href="/app-onboarding" className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
          <Plus className="w-4 h-4 mr-2" /> Onboard Product
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && apps.length === 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center bg-white dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No products yet. Get started by onboarding your first product.</p>
          <div className="mt-4">
            <Link href="/app-onboarding" className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" /> Onboard Product
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link key={app.id} href={`/products/${app.id}`} className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{app.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{app.description || '—'}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                app.status === 'active' ? 'bg-green-100 text-green-800' : app.status === 'inactive' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'
              }`}>{app.status}</span>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
              <div className="flex items-center"><Globe className="w-4 h-4 mr-1" />{app.domain}</div>
              <div className="flex items-center"><Settings className="w-4 h-4 mr-1" />{app.environment}</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">Updated {new Date(app.updated || app.created).toLocaleString()}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
