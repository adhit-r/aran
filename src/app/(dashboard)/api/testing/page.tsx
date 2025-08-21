'use client'

import { useState } from 'react'
import { Play, Save, Settings, History, Code, Globe, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function ApiTestingPage() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [body, setBody] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runTest = async () => {
    if (!url) return

    setIsRunning(true)
    setResult(null)

    try {
      const startTime = Date.now()
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined
      })
      const responseTime = Date.now() - startTime
      
      let responseBody
      try {
        responseBody = await response.json()
      } catch {
        responseBody = await response.text()
      }

      setResult({
        status: response.status,
        responseTime,
        success: response.ok,
        response: responseBody,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      setResult({
        status: 0,
        responseTime: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Testing</h1>
          <p className="mt-2 text-gray-600">Test your APIs with a Postman-like interface</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Request</h2>
            <button
              onClick={runTest}
              disabled={!url || isRunning}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Send'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Enter JSON body..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
            </div>
          )}

          {result && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-1" />
                  )}
                  Status: {result.status}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {result.responseTime}ms
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Response Body</h4>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(result.response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
