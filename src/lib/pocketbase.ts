import PocketBase from 'pocketbase';

// PocketBase client configuration
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Types for Aran collections
export interface Company {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  settings?: any;
  status: 'active' | 'suspended' | 'pending';
  created: string;
  updated: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company: string; // Company ID
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  avatar?: string;
  verified: boolean;
  created: string;
  updated: string;
}

export interface ApiDocument {
  id: string;
  company: string; // Company ID
  fileName: string;
  title?: string;
  version?: string;
  format: 'openapi' | 'swagger' | 'raml' | 'graphql' | 'other';
  file: string; // File URL
  description?: string;
  tags?: string[];
  uploadedBy: string; // User ID
  created: string;
  updated: string;
}

export interface ApiCatalog {
  id: string;
  company: string; // Company ID
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  category?: string;
  owner?: string;
  status: 'active' | 'deprecated' | 'development';
  documentationUrl?: string;
  created: string;
  updated: string;
}

export interface McpImplementation {
  id: string;
  company: string; // Company ID
  name: string;
  description?: string;
  endpoints?: string[];
  dataSources?: string[];
  actions?: string[];
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'monitoring' | 'inactive';
  created: string;
  updated: string;
}

export interface SecurityPolicy {
  id: string;
  company: string; // Company ID
  name: string;
  description?: string;
  type: 'authentication' | 'authorization' | 'rate_limiting' | 'encryption' | 'validation';
  rules: any;
  status: 'active' | 'inactive' | 'draft';
  created: string;
  updated: string;
}

export interface AuditLog {
  id: string;
  company: string; // Company ID
  user: string; // User ID
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
  created: string;
  updated: string;
}

// Helper functions for multi-tenant operations
export const getCurrentUser = () => {
  return pb.authStore.model as User | null;
};

export const getCurrentCompany = () => {
  const user = getCurrentUser();
  return user?.company;
};

export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

export const logout = () => {
  pb.authStore.clear();
};

// Company-specific queries
export const getCompanyData = async <T>(
  collection: string,
  options?: any
): Promise<{ items: T[]; totalItems: number; totalPages: number; page: number; perPage: number }> => {
  const company = getCurrentCompany();
  if (!company) throw new Error('No company context');
  
  return await pb.collection(collection).getList(1, 50, {
    filter: `company = "${company}"`,
    ...options
  });
};

// Audit logging
export const logAuditEvent = async (
  action: string,
  resource: string,
  details?: any
) => {
  const user = getCurrentUser();
  const company = getCurrentCompany();
  
  if (!user || !company) return;
  
  await pb.collection('audit_logs').create({
    company,
    user: user.id,
    action,
    resource,
    details,
    ipAddress: '127.0.0.1' // TODO: Get real IP
  });
}; 