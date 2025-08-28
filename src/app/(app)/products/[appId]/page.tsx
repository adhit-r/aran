'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { pb, logAuditEvent } from '@/lib/pocketbase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Globe, Settings, Database, FileText, Beaker, Share2, Edit, Save, X, Plus, Trash2, History, Users, Shield, Clock } from 'lucide-react'

interface AppRecord {
  id: string
  name: string
  description?: string
  domain: string
  environment: string
  status: string
  maintainers?: string[]
  created: string
  updated: string
  createdBy?: string
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
  createdBy?: string
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

interface AuditLog {
  id: string
  action: string
  details: string
  timestamp: string
  user?: string
}

export default function ProductDetailPage() {
  const params = useParams<{ appId: string }>()
  const router = useRouter()
  const appId = params?.appId

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const [app, setApp] = useState<AppRecord | null>(null)
  const [endpoints, setEndpoints] = useState<EndpointRecord[]>([])
  const [tests, setTests] = useState<TestRecord[]>([])
  const [specTitle, setSpecTitle] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    domain: '',
    environment: '',
    status: '',
    maintainers: [] as string[]
  })

  useEffect(() => {
    if (!appId) return
    const load = async () => {
      try {
        // App
        const appRec = await pb.collection('apps').getOne(appId as string)
        setApp(appRec as unknown as AppRecord)
        
        // Initialize edit form
        setEditForm({
          name: appRec.name || '',
          description: appRec.description || '',
          domain: appRec.domain || '',
          environment: appRec.environment || '',
          status: appRec.status || 'active',
          maintainers: appRec.maintainers || []
        })

        // Endpoints
        const eps = await pb.collection('api_endpoints').getList(1, 200, {
          sort: '-updated',
          filter: `appId = "${appId}"`,
        })
        setEndpoints(eps.items as unknown as EndpointRecord[])

        // Tests
        const t = await pb.collection('api_tests').getList(1, 100, {
          sort: '-lastRun',
        })
        setTests(t.items as unknown as TestRecord[])

        // Swagger spec (latest)
        const specs = await pb.collection('swagger_specs').getList(1, 1, {
          sort: '-updated',
          filter: `appId = "${appId}"`,
        })
        setSpecTitle(specs.items?.[0]?.title || null)

        // Audit logs
        const logs = await pb.collection('audit_logs').getList(1, 10, {
          sort: '-created',
          filter: `resource = "apps:${appId}"`,
        })
        setAuditLogs(logs.items.map((log: any) => ({
          id: log.id,
          action: log.action,
          details: log.details ? JSON.stringify(log.details) : '',
          timestamp: log.created,
          user: log.user
        })))
      } catch (e: any) {
        setError(e?.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [appId])

  const handleSave = async () => {
    if (!appId) return
    
    try {
      setLoading(true)
      const updatedApp = await pb.collection('apps').update(appId, editForm)
      setApp(updatedApp as unknown as AppRecord)
      setEditing(false)
      
      // Add to audit log
      await logAuditEvent('Product Updated', `apps:${appId}`, {
        fields: Object.keys(editForm),
        previousValues: app,
        newValues: editForm
      })
      
      // Reload audit logs to show the latest activity
      const logs = await pb.collection('audit_logs').getList(1, 10, {
        sort: '-created',
        filter: `resource = "apps:${appId}"`,
      })
      setAuditLogs(logs.items.map((log: any) => ({
        id: log.id,
        action: log.action,
        details: log.details ? JSON.stringify(log.details) : '',
        timestamp: log.created,
        user: log.user
      })))
    } catch (e: any) {
      setError(e?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!appId) return
    
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }
    
    try {
      setLoading(true)
      await pb.collection('apps').delete(appId)
      
      // Log the deletion
      await logAuditEvent('Product Deleted', `apps:${appId}`, {
        productName: app?.name,
        productId: appId
      })
      
      router.push('/products')
    } catch (e: any) {
      setError(e?.message || 'Failed to delete product')
      setLoading(false)
    }
  }

  const statusPill = (status?: string) => (
    <Badge variant={status === 'active' ? 'default' : status === 'inactive' ? 'secondary' : 'destructive'}>
      {status || '—'}
    </Badge>
  )

  const getSecurityScore = () => {
    if (endpoints.length === 0) return 0
    const secured = endpoints.filter(e => e.authentication && e.authentication !== 'none').length
    return Math.round((secured / endpoints.length) * 100)
  }

  const getTestPassRate = () => {
    if (tests.length === 0) return 0
    const passed = tests.filter(t => t.lastResult?.success).length
    return Math.round((passed / tests.length) * 100)
  }

  if (!appId) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/products')} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
        </button>
        
        <div className="flex items-center space-x-2">
          {editing ? (
            <>
              <Button onClick={handleSave} disabled={loading} size="sm">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)} size="sm">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button onClick={handleDelete} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          {loading && <p className="text-gray-500">Loading…</p>}
          {error && <p className="text-red-600">{error}</p>}
          {app && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter product description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domain">Domain</Label>
                        <Input
                          id="domain"
                          value={editForm.domain}
                          onChange={(e) => setEditForm(prev => ({ ...prev, domain: e.target.value }))}
                          placeholder="api.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="environment">Environment</Label>
                        <Select value={editForm.environment} onValueChange={(value) => setEditForm(prev => ({ ...prev, environment: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="staging">Staging</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">{app.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{app.description || '—'}</p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center"><Globe className="w-4 h-4 mr-1" />{app.domain}</div>
                      <div className="flex items-center"><Settings className="w-4 h-4 mr-1" />{app.environment}</div>
                      {statusPill(app.status)}
                    </div>
                    {app.maintainers && app.maintainers.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        Maintainers: {app.maintainers.join(', ')}
                      </div>
                    )}
                  </>
                )}
              </div>
              {specTitle && !editing && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Docs</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{specTitle}</p>
                </div>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Endpoints</p>
                  <Database className="w-5 h-5 text-primary-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{endpoints.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total API endpoints</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Security Score</p>
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getSecurityScore()}%</p>
                <p className="text-xs text-gray-500 mt-1">Endpoints with auth</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tests</p>
                  <Beaker className="w-5 h-5 text-primary-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{tests.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total test cases</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Test Pass Rate</p>
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getTestPassRate()}%</p>
                <p className="text-xs text-gray-500 mt-1">Recent test runs</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{log.details}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">{log.user}</p>
                          <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {specTitle ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Latest spec: <span className="font-medium text-gray-900 dark:text-white">{specTitle}</span>
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      View Documentation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-500">No docs imported yet.</p>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Import OpenAPI
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="apis">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Endpoints</CardTitle>
                <Link href="/api-discovery">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Discover / Import
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-3 pr-4 font-medium">Method</th>
                      <th className="py-3 pr-4 font-medium">Path</th>
                      <th className="py-3 pr-4 font-medium">Auth</th>
                      <th className="py-3 pr-4 font-medium">Rate Limit</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 pr-4 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((e) => (
                      <tr key={e.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 pr-4">
                          <Badge variant={e.method === 'GET' ? 'default' : e.method === 'POST' ? 'secondary' : 'outline'}>
                            {e.method}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs">{e.path}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={e.authentication && e.authentication !== 'none' ? 'default' : 'destructive'}>
                            {e.authentication || 'none'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">{e.rateLimit || 0}</td>
                        <td className="py-3 pr-4">{statusPill(e.status)}</td>
                        <td className="py-3 pr-4 text-xs">{new Date((e as any).updated || '').toLocaleString()}</td>
                      </tr>
                    ))}
                    {endpoints.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No endpoints found. Start by discovering APIs.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              {specTitle ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Latest spec: <span className="font-medium text-gray-900 dark:text-white">{specTitle}</span>
                  </p>
                  <div className="flex space-x-2">
                    <Button>
                      <FileText className="w-4 h-4 mr-1" />
                      View Documentation
                    </Button>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Documentation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-500">No documentation imported yet.</p>
                  <div className="flex space-x-2">
                    <Button>
                      <Plus className="w-4 h-4 mr-1" />
                      Import OpenAPI
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Create Manual Docs
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Testing</CardTitle>
                <Link href="/api-testing">
                  <Button size="sm">
                    <Beaker className="w-4 h-4 mr-1" />
                    Open API Testing
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.slice(0, 10).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{t.method} {t.url}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {t.lastResult?.success ? (
                          <Badge variant="default">Pass</Badge>
                        ) : (
                          <Badge variant="destructive">Fail</Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {t.lastRun ? new Date(t.lastRun).toLocaleString() : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {tests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No tests found. Create tests in the API Testing section.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                API Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share endpoints and tests within your organization or with external partners.
                </p>
                <div className="flex space-x-2">
                  <Button>
                    <Share2 className="w-4 h-4 mr-1" />
                    Share Endpoints
                  </Button>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-1" />
                    Manage Access
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Sharing management UI will be enhanced in Phase 8 - Cross-Org Access.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Product ID</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{appId}</p>
                    </div>
                    <div>
                      <Label>Created</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app ? new Date(app.created).toLocaleString() : '—'}
                      </p>
                    </div>
                    <div>
                      <Label>Last Updated</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app ? new Date(app.updated).toLocaleString() : '—'}
                      </p>
                    </div>
                    <div>
                      <Label>Created By</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app?.createdBy || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-100">Delete Product</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Permanently delete this product and all associated data.
                        </p>
                      </div>
                      <Button onClick={handleDelete} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete Product
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
