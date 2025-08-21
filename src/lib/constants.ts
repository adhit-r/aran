// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002',
  POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090',
  TIMEOUT: 10000,
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'Aran API Sentinel',
  DESCRIPTION: 'Comprehensive API security and management platform',
  VERSION: '1.0.0',
  COMPANY: 'Aran Security',
}

// Navigation IA
export const NAV_CATEGORIES = [
  { key: 'main', title: 'Overview', order: 1 },
  { key: 'apps', title: 'Applications', order: 2 },
  { key: 'apis', title: 'APIs', order: 3 },
  { key: 'security', title: 'Security', order: 4 },
  { key: 'governance', title: 'API Governance', order: 5 },
  { key: 'ai', title: 'AI & Automation', order: 6 },
  { key: 'admin', title: 'Administration', order: 7 },
] as const

export type NavCategoryKey = typeof NAV_CATEGORIES[number]['key']

export type NavItem = {
  title: string
  href: string
  icon:
    | 'Shield'
    | 'Plus'
    | 'Search'
    | 'Database'
    | 'FileText'
    | 'Play'
    | 'Activity'
    | 'Lock'
    | 'Globe'
    | 'Zap'
    | 'Brain'
    | 'Settings'
    | 'Users'
  description?: string
  category: NavCategoryKey
  order: number
}

export const NAV_ITEMS: readonly NavItem[] = [
  // Overview
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'Shield',
    description: 'Overview and analytics',
    category: 'main',
    order: 1,
  },

  // Applications
  {
    title: 'Products',
    href: '/products',
    icon: 'Database',
    description: 'Applications in your organization',
    category: 'apps',
    order: 0,
  },
  {
    title: 'App Onboarding',
    href: '/app-onboarding',
    icon: 'Plus',
    description: 'Onboard new applications',
    category: 'apps',
    order: 1,
  },

  // APIs
  {
    title: 'API Discovery',
    href: '/api-discovery',
    icon: 'Search',
    description: 'Discover and analyze APIs',
    category: 'apis',
    order: 1,
  },
  {
    title: 'API Catalog',
    href: '/api-catalog',
    icon: 'Database',
    description: 'Browse API catalog',
    category: 'apis',
    order: 2,
  },
  {
    title: 'API Documentation',
    href: '/api-documentation',
    icon: 'FileText',
    description: 'Generated and manual docs',
    category: 'apis',
    order: 3,
  },
  {
    title: 'API Testing',
    href: '/api-testing',
    icon: 'Play',
    description: 'Test requests and collections',
    category: 'apis',
    order: 4,
  },

  // Security
  {
    title: 'API Security',
    href: '/api-security',
    icon: 'Shield',
    description: 'Authentication, authorization, rate limiting, posture',
    category: 'security',
    order: 1,
  },
  {
    title: 'Threat Detection',
    href: '/threat-detection',
    icon: 'Activity',
    description: 'Detection rules and alerts',
    category: 'security',
    order: 2,
  },
  {
    title: 'MCP Security',
    href: '/mcp-security',
    icon: 'Lock',
    description: 'Model Context Protocol security',
    category: 'security',
    order: 3,
  },
  {
    title: 'MCP Discovery',
    href: '/mcp-discovery',
    icon: 'Globe',
    description: 'Discover MCP tools',
    category: 'security',
    order: 4,
  },
  {
    title: 'MCP Threats',
    href: '/mcp-threats',
    icon: 'Zap',
    description: 'MCP threat analysis',
    category: 'security',
    order: 5,
  },

  // Governance
  {
    title: 'API Governance',
    href: '/api-governance',
    icon: 'Settings',
    description: 'Standards, lifecycle, approvals, ownership',
    category: 'governance',
    order: 1,
  },
  {
    title: 'Standards & Policies',
    href: '/governance/standards',
    icon: 'FileText',
    description: 'Style guides, security and compliance policies',
    category: 'governance',
    order: 2,
  },

  // AI & Automation
  {
    title: 'AI Providers',
    href: '/ai-providers',
    icon: 'Brain',
    description: 'Hybrid AI routing and metrics',
    category: 'ai',
    order: 1,
  },

  // Administration
  {
    title: 'Security Policies',
    href: '/security-policies',
    icon: 'Settings',
    description: 'Policies, rules and controls',
    category: 'admin',
    order: 1,
  },
  {
    title: 'Access Control',
    href: '/access-control',
    icon: 'Users',
    description: 'Users, roles and orgs',
    category: 'admin',
    order: 2,
  },
] as const

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: 'theme',
  DEFAULT_THEME: 'light' as const,
  THEMES: ['light', 'dark'] as const,
}

// Status Types
export const STATUS_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
} as const

// API Categories
export const API_CATEGORIES = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  ADMIN: 'admin',
} as const

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const

// Authentication Types
export const AUTH_TYPES = {
  NONE: 'none',
  API_KEY: 'api_key',
  BEARER: 'bearer',
  OAUTH2: 'oauth2',
} as const

// Environment Types
export const ENVIRONMENT_TYPES = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const

// App Status Types
export const APP_STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const

// API Status Types
export const API_STATUS_TYPES = {
  ACTIVE: 'active',
  DEPRECATED: 'deprecated',
  MAINTENANCE: 'maintenance',
} as const
