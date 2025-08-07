#!/usr/bin/env bun

import { Database } from 'bun:sqlite'
import { join } from 'path'

interface Company {
  id: string
  name: string
  domain: string
  logo?: string
  settings: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'analyst' | 'viewer'
  companyId: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

interface ApiEndpoint {
  id: string
  path: string
  method: string
  status: 'active' | 'inactive' | 'deprecated'
  security: 'secure' | 'insecure' | 'unknown'
  companyId: string
  lastSeen: string
  traffic: number
  createdAt: string
  updatedAt: string
}

const db = new Database(join(process.cwd(), 'data', 'aran.db'))

console.log('🌱 Seeding database...')

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    logo TEXT,
    settings TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    companyId TEXT NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    lastLogin TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (companyId) REFERENCES companies (id)
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS api_endpoints (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL,
    security TEXT NOT NULL,
    companyId TEXT NOT NULL,
    lastSeen TEXT NOT NULL,
    traffic INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (companyId) REFERENCES companies (id)
  )
`)

// Seed companies
const companies: Company[] = [
  {
    id: 'company-1',
    name: 'TechCorp',
    domain: 'techcorp.com',
    logo: 'https://via.placeholder.com/150x50/2563eb/ffffff?text=TechCorp',
    settings: {
      theme: 'light',
      timezone: 'UTC',
      features: ['api-discovery', 'threat-detection', 'mcp-security']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'company-2',
    name: 'SecureBank',
    domain: 'securebank.com',
    logo: 'https://via.placeholder.com/150x50/16a34a/ffffff?text=SecureBank',
    settings: {
      theme: 'dark',
      timezone: 'America/New_York',
      features: ['api-discovery', 'threat-detection', 'mcp-security', 'compliance']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Seed users
const users: User[] = [
  {
    id: 'user-1',
    email: 'admin@techcorp.com',
    name: 'Admin User',
    role: 'admin',
    companyId: 'company-1',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    email: 'analyst@techcorp.com',
    name: 'Security Analyst',
    role: 'analyst',
    companyId: 'company-1',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-3',
    email: 'admin@securebank.com',
    name: 'Bank Admin',
    role: 'admin',
    companyId: 'company-2',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Seed API endpoints
const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'api-1',
    path: '/api/users',
    method: 'GET',
    status: 'active',
    security: 'secure',
    companyId: 'company-1',
    lastSeen: new Date().toISOString(),
    traffic: 1250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'api-2',
    path: '/api/auth/login',
    method: 'POST',
    status: 'active',
    security: 'insecure',
    companyId: 'company-1',
    lastSeen: new Date().toISOString(),
    traffic: 2340,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'api-3',
    path: '/api/transactions',
    method: 'GET',
    status: 'active',
    security: 'secure',
    companyId: 'company-2',
    lastSeen: new Date().toISOString(),
    traffic: 890,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Insert data
const insertCompany = db.prepare(`
  INSERT OR REPLACE INTO companies (id, name, domain, logo, settings, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, email, name, role, companyId, isActive, lastLogin, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const insertApiEndpoint = db.prepare(`
  INSERT OR REPLACE INTO api_endpoints (id, path, method, status, security, companyId, lastSeen, traffic, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

// Insert companies
for (const company of companies) {
  insertCompany.run(
    company.id,
    company.name,
    company.domain,
    company.logo,
    JSON.stringify(company.settings),
    company.createdAt,
    company.updatedAt
  )
}

// Insert users
for (const user of users) {
  insertUser.run(
    user.id,
    user.email,
    user.name,
    user.role,
    user.companyId,
    user.isActive ? 1 : 0,
    user.lastLogin,
    user.createdAt,
    user.updatedAt
  )
}

// Insert API endpoints
for (const endpoint of apiEndpoints) {
  insertApiEndpoint.run(
    endpoint.id,
    endpoint.path,
    endpoint.method,
    endpoint.status,
    endpoint.security,
    endpoint.companyId,
    endpoint.lastSeen,
    endpoint.traffic,
    endpoint.createdAt,
    endpoint.updatedAt
  )
}

console.log('✅ Database seeded successfully!')
console.log(`📊 Inserted ${companies.length} companies`)
console.log(`👥 Inserted ${users.length} users`)
console.log(`🔗 Inserted ${apiEndpoints.length} API endpoints`)

db.close()
