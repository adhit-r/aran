'use client'

import { Shield, Activity, Database, Users, Settings, Bell, Search, Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome to Aran API Sentinel
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
              </button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                New Scan
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <Shield className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total APIs</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100 text-success-600">
                <Activity className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Scans</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                <Database className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Threats Detected</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-error-100 text-error-600">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Users</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">API scan completed</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Threat detected</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New API discovered</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Search className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Scan APIs</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Security Check</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Database className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">View Catalog</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Settings</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">98%</div>
                <div className="text-sm text-gray-500">Security Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">3</div>
                <div className="text-sm text-gray-500">Active Threats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-gray-500">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

    
