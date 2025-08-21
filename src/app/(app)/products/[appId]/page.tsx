'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { pb } from '@/lib/pocketbase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Globe, Settings, Database, FileText, Beaker, Share2 } from 'lucide-react'

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

interface EndpointRecord {
  id: string
  name: string
  path: string
  method: string
  status: string
  authentication: string
  rateLimit: number
  updated: string
}

interface TestRecord {
  id: string
  name: string
  method: string
  url: string
  expectedStatus: number
  lastRun?: string
  lastResult?: { success?: boolean; status?: number; responseTime?: number }
}

export default function ProductDetailPage() {
  const params = useParams<{ appId: string }>()
  const router = useRouter()
  const appId = params?.appId

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [app, setApp] = useState<AppRecord | null>(null)
  const [endpoints, setEndpoints] = useState<EndpointRecord[]>([])
  const [tests, setTests] = useState<TestRecord[]>([])
  const [specTitle, setSpecTitle] = useState<string | null>(null)

  useEffect(() => {
    if (!appId) return
    const load = async () => {
      try {
        // App
        const appRec = await pb.collection('apps').getOne(appId as string)
        setApp(appRec as unknown as AppRecord)

        // Endpoints
        const eps = await pb.collection('api_endpoints').getList(1, 200, {
          sort: '-updated',
          filter: `appId = "${appId}"`,
        })
        setEndpoints(eps.items as unknown as EndpointRecord[])

        // Tests (by url contains domain or attached separately later)
        const t = await pb.collection('api_tests').getList(1, 100, {
          sort: '-lastRun',
          // fallback: fetch all; future: store appId on test
        })
        setTests(t.items as unknown as TestRecord[])

        // Swagger spec (latest)
        const specs = await pb.collection('swagger_specs').getList(1, 1, {
          sort: '-updated',
          filter: `appId = "${appId}"`,
        })
        setSpecTitle(specs.items?.[0]?.title || null)
      } catch (e: any) {
        setError(e?.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [appId])

  const statusPill = (status?: string) => (
    <span className={`px-2 py-1 text-xs rounded-full ${
      status === 'active' ? 'bg-green-100 text-green-800' : status === 'inactive' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'
    }`}>{status || '—'}</span>
  )

  if (!appId) return null

  return (
    <div className="space-y-6">
      <button onClick={() => router.push('/products')} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </button>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {app && (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{app.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{app.description || '—'}</p>
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center"><Globe className="w-4 h-4 mr-1" />{app.domain}</div>
                <div className="flex items-center"><Settings className="w-4 h-4 mr-1" />{app.environment}</div>
                {statusPill(app.status)}
              </div>
            </div>
            {specTitle && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Docs</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{specTitle}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Endpoints</p>
                <Database className="w-5 h-5 text-primary-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{endpoints.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests</p>
                <Beaker className="w-5 h-5 text-primary-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{tests.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Documentation</p>
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{specTitle || 'Not imported'}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="apis">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Endpoints</p>
              <Link href="/api-discovery" className="text-sm text-primary-600 hover:text-primary-700">Discover / Import</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Method</th>
                    <th className="py-2 pr-4">Path</th>
                    <th className="py-2 pr-4">Auth</th>
                    <th className="py-2 pr-4">Rate Limit</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((e) => (
                    <tr key={e.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="py-2 pr-4 font-medium">{e.method}</td>
                      <td className="py-2 pr-4">{e.path}</td>
                      <td className="py-2 pr-4">{e.authentication || 'none'}</td>
                      <td className="py-2 pr-4">{e.rateLimit || 0}</td>
                      <td className="py-2 pr-4">{e.status}</td>
                      <td className="py-2 pr-4">{new Date((e as any).updated || '').toLocaleString()}</td>
                    </tr>
                  ))}
                  {endpoints.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500">No endpoints</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            {specTitle ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">Latest spec: <span className="font-medium text-gray-900 dark:text-white">{specTitle}</span></p>
            ) : (
              <p className="text-gray-500">No docs imported yet. Use Discovery/Import to attach OpenAPI.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="testing">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Recent Tests</p>
              <Link href="/api-testing" className="text-sm text-primary-600 hover:text-primary-700">Open API Testing</Link>
            </div>
            <div className="space-y-2">
              {tests.slice(0, 10).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm border border-gray-100 dark:border-gray-700 rounded p-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.method} {t.url}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {t.lastRun ? new Date(t.lastRun).toLocaleString() : '—'}
                  </div>
                </div>
              ))}
              {tests.length === 0 && <p className="text-gray-500">No tests yet.</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sharing">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Share endpoints/tests within your organization.</p>
              <Share2 className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Sharing management UI will be added here.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Edit product details and environments.</p>
            <p className="text-xs text-gray-500 mt-2">Settings form will be added here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
