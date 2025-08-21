export interface App {
  id: string;
  name: string;
  description: string;
  companyId: string;
  domain: string;
  environment: 'development' | 'staging' | 'production';
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  settings: {
    allowPublicApis: boolean;
    requireAuthentication: boolean;
    rateLimitPerMinute: number;
    maxRequestSize: number;
  };
}

export interface ApiEndpoint {
  id: string;
  appId: string;
  name: string;
  description: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  category: 'public' | 'internal' | 'admin';
  status: 'active' | 'deprecated' | 'maintenance';
  version: string;
  authentication: 'none' | 'api_key' | 'bearer' | 'oauth2';
  rateLimit: number;
  responseTime: number;
  lastTested: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  documentation: {
    summary: string;
    parameters: ApiParameter[];
    responses: ApiResponse[];
    examples: ApiExample[];
  };
}

export interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: string;
  example?: string;
}

export interface ApiResponse {
  code: number;
  description: string;
  schema?: object;
  example?: object;
}

export interface ApiExample {
  name: string;
  description: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: object;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body?: object;
  };
}

export interface ApiTest {
  id: string;
  apiId: string;
  name: string;
  description: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: object;
  queryParams?: Record<string, string>;
  expectedStatus: number;
  expectedResponse?: object;
  timeout: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastRun?: string;
  lastResult?: {
    status: number;
    responseTime: number;
    success: boolean;
    error?: string;
    response?: object;
  };
}

export interface ApiCollection {
  id: string;
  name: string;
  description: string;
  appId: string;
  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tests: ApiTest[];
}

export interface ApiShare {
  id: string;
  apiId: string;
  sharedBy: string;
  sharedWith: string;
  permissions: 'read' | 'write' | 'admin';
  expiresAt?: string;
  createdAt: string;
}

export interface SwaggerSpec {
  id: string;
  appId: string;
  version: string;
  title: string;
  description: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AppOnboardingData {
  app: Omit<App, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
  initialApis: Omit<ApiEndpoint, 'id' | 'appId' | 'createdAt' | 'updatedAt' | 'createdBy'>[];
  swaggerUrl?: string;
}
