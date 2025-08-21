'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Globe, 
  Settings, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { AppManagementService } from '@/lib/app-management'
import { pb, getCurrentCompany, getCurrentUser } from '@/lib/pocketbase'

type OnboardingStep = 'app-info' | 'api-setup' | 'swagger-import' | 'review'

export default function AppOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('app-info')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [appData, setAppData] = useState({
    name: '',
    description: '',
    domain: '',
    environment: 'development' as const,
    settings: {
      allowPublicApis: false,
      requireAuthentication: true,
      rateLimitPerMinute: 1000,
      maxRequestSize: 10485760
    }
  })

  const [apis, setApis] = useState<any[]>([])
  const [swaggerUrl, setSwaggerUrl] = useState('')

  const steps = [
    { id: 'app-info', title: 'App Information', icon: Settings },
    { id: 'api-setup', title: 'API Setup', icon: Globe },
    { id: 'swagger-import', title: 'Swagger Import', icon: Upload },
    { id: 'review', title: 'Review & Create', icon: CheckCircle }
  ]

  const handleAppDataChange = (field: string, value: any) => {
    setAppData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSettingsChange = (field: string, value: any) => {
    setAppData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }))
  }

  const addApi = () => {
    const newApi = {
      name: '',
      description: '',
      path: '',
      method: 'GET',
      category: 'public',
      status: 'active',
      version: '1.0.0',
      authentication: 'none',
      rateLimit: 1000,
      responseTime: 0,
      lastTested: '',
      tags: [],
      documentation: {
        summary: '',
        parameters: [],
        responses: [],
        examples: []
      }
    }
    setApis(prev => [...prev, newApi])
  }

  const updateApi = (index: number, field: string, value: any) => {
    setApis(prev => prev.map((api, i) => 
      i === index ? { ...api, [field]: value } : api
    ))
  }

  const removeApi = (index: number) => {
    setApis(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      const user = getCurrentUser()
      const companyId = getCurrentCompany()
      if (!user || !companyId) {
        throw new Error('Please log in to your organization before onboarding a product')
      }

      const onboardingData = {
        app: {
          ...appData,
          companyId,
          status: 'active' as const,
        },
        initialApis: apis,
        swaggerUrl: swaggerUrl || undefined,
      }

      const result = await AppManagementService.onboardApp(onboardingData as any, user.id)

      router.push(`/products/${result.app.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create app')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'app-info':
        return appData.name && appData.domain
      case 'api-setup':
        return true // Optional step
      case 'swagger-import':
        return true // Optional step
      case 'review':
        return appData.name && appData.domain
      default:
        return false
    }
  }

  const nextStep = () => {
    if (canProceed()) {
      const currentIndex = steps.findIndex(s => s.id === currentStep)
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id as OnboardingStep)
      }
    }
  }

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as OnboardingStep)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Onboard Your App</h1>
          <p className="mt-2 text-gray-600">Add your application and APIs to Aran API Sentinel</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {currentStep === 'app-info' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">App Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name *
                  </label>
                  <input
                    type="text"
                    value={appData.name}
                    onChange={(e) => handleAppDataChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="My Awesome App"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain *
                  </label>
                  <input
                    type="url"
                    value={appData.domain}
                    onChange={(e) => handleAppDataChange('domain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://api.myapp.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment
                  </label>
                  <select
                    value={appData.environment}
                    onChange={(e) => handleAppDataChange('environment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={appData.description}
                    onChange={(e) => handleAppDataChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your application..."
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">App Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowPublicApis"
                      checked={appData.settings.allowPublicApis}
                      onChange={(e) => handleSettingsChange('allowPublicApis', e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="allowPublicApis" className="ml-2 text-sm text-gray-700">
                      Allow Public APIs
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireAuthentication"
                      checked={appData.settings.requireAuthentication}
                      onChange={(e) => handleSettingsChange('requireAuthentication', e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="requireAuthentication" className="ml-2 text-sm text-gray-700">
                      Require Authentication
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Limit (per minute)
                    </label>
                    <input
                      type="number"
                      value={appData.settings.rateLimitPerMinute}
                      onChange={(e) => handleSettingsChange('rateLimitPerMinute', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Request Size (bytes)
                    </label>
                    <input
                      type="number"
                      value={appData.settings.maxRequestSize}
                      onChange={(e) => handleSettingsChange('maxRequestSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'api-setup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">API Setup</h2>
                <button
                  onClick={addApi}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add API
                </button>
              </div>

              {apis.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No APIs added yet. Add your first API or import from Swagger.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apis.map((api, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">API {index + 1}</h3>
                        <button
                          onClick={() => removeApi(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={api.name}
                            onChange={(e) => updateApi(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Get Users"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Method
                          </label>
                          <select
                            value={api.method}
                            onChange={(e) => updateApi(index, 'method', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Path
                          </label>
                          <input
                            type="text"
                            value={api.path}
                            onChange={(e) => updateApi(index, 'path', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="/api/users"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={api.category}
                            onChange={(e) => updateApi(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="public">Public</option>
                            <option value="internal">Internal</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Authentication
                          </label>
                          <select
                            value={api.authentication}
                            onChange={(e) => updateApi(index, 'authentication', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="none">None</option>
                            <option value="api_key">API Key</option>
                            <option value="bearer">Bearer Token</option>
                            <option value="oauth2">OAuth 2.0</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rate Limit
                          </label>
                          <input
                            type="number"
                            value={api.rateLimit}
                            onChange={(e) => updateApi(index, 'rateLimit', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={api.description}
                          onChange={(e) => updateApi(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Describe this API endpoint..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 'swagger-import' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Swagger Import</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Upload className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Import from Swagger/OpenAPI</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Provide a URL to your Swagger/OpenAPI specification to automatically import all endpoints.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Swagger URL
                </label>
                <input
                  type="url"
                  value={swaggerUrl}
                  onChange={(e) => setSwaggerUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://api.myapp.com/swagger.json"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty if you want to add APIs manually
                </p>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review & Create</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">App Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-900">{appData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Domain</p>
                    <p className="text-gray-900">{appData.domain}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Environment</p>
                    <p className="text-gray-900 capitalize">{appData.environment}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{appData.description || 'No description'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">APIs ({apis.length})</h3>
                {apis.length === 0 ? (
                  <p className="text-gray-500">No APIs added</p>
                ) : (
                  <div className="space-y-2">
                    {apis.map((api, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">{api.name}</p>
                          <p className="text-sm text-gray-500">{api.method} {api.path}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          api.category === 'public' ? 'bg-green-100 text-green-800' :
                          api.category === 'internal' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {api.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {swaggerUrl && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Swagger Import</h3>
                  <p className="text-gray-900">{swaggerUrl}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 'app-info'}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-3">
              {currentStep === 'review' ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !canProceed()}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create App'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
