import PocketBase from 'pocketbase';
import type { App, ApiEndpoint, ApiTest, ApiCollection, ApiShare, SwaggerSpec, AppOnboardingData } from '@/types/app-management';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

export class AppManagementService {
  // App Management
  static async createApp(appData: Omit<App, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, userId: string): Promise<App> {
    const data = {
      ...appData,
      createdBy: userId,
      settings: appData.settings || {
        allowPublicApis: false,
        requireAuthentication: true,
        rateLimitPerMinute: 1000,
        maxRequestSize: 10485760 // 10MB
      }
    };
    
    const record = await pb.collection('apps').create(data);
    return this.mapAppRecord(record);
  }

  static async getAppsByCompany(companyId: string): Promise<App[]> {
    const records = await pb.collection('apps').getList(1, 50, {
      filter: `companyId = "${companyId}"`,
      sort: '-created'
    });
    
    return records.items.map(this.mapAppRecord);
  }

  static async getAppById(appId: string): Promise<App | null> {
    try {
      const record = await pb.collection('apps').getOne(appId);
      return this.mapAppRecord(record);
    } catch {
      return null;
    }
  }

  static async updateApp(appId: string, updates: Partial<App>): Promise<App> {
    const record = await pb.collection('apps').update(appId, updates);
    return this.mapAppRecord(record);
  }

  static async deleteApp(appId: string): Promise<void> {
    await pb.collection('apps').delete(appId);
  }

  // API Endpoint Management
  static async createApiEndpoint(apiData: Omit<ApiEndpoint, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, userId: string): Promise<ApiEndpoint> {
    const data = {
      ...apiData,
      createdBy: userId,
      tags: apiData.tags || [],
      documentation: apiData.documentation || {
        summary: '',
        parameters: [],
        responses: [],
        examples: []
      }
    };
    
    const record = await pb.collection('api_endpoints').create(data);
    return this.mapApiEndpointRecord(record);
  }

  static async getApiEndpointsByApp(appId: string): Promise<ApiEndpoint[]> {
    const records = await pb.collection('api_endpoints').getList(1, 100, {
      filter: `appId = "${appId}"`,
      sort: '-created'
    });
    
    return records.items.map(this.mapApiEndpointRecord);
  }

  static async getApiEndpointById(apiId: string): Promise<ApiEndpoint | null> {
    try {
      const record = await pb.collection('api_endpoints').getOne(apiId);
      return this.mapApiEndpointRecord(record);
    } catch {
      return null;
    }
  }

  static async updateApiEndpoint(apiId: string, updates: Partial<ApiEndpoint>): Promise<ApiEndpoint> {
    const record = await pb.collection('api_endpoints').update(apiId, updates);
    return this.mapApiEndpointRecord(record);
  }

  static async deleteApiEndpoint(apiId: string): Promise<void> {
    await pb.collection('api_endpoints').delete(apiId);
  }

  // API Testing
  static async createApiTest(testData: Omit<ApiTest, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, userId: string): Promise<ApiTest> {
    const data = {
      ...testData,
      createdBy: userId,
      headers: testData.headers || {},
      body: testData.body || null,
      queryParams: testData.queryParams || {}
    };
    
    const record = await pb.collection('api_tests').create(data);
    return this.mapApiTestRecord(record);
  }

  static async getApiTestsByApi(apiId: string): Promise<ApiTest[]> {
    const records = await pb.collection('api_tests').getList(1, 50, {
      filter: `apiId = "${apiId}"`,
      sort: '-created'
    });
    
    return records.items.map(this.mapApiTestRecord);
  }

  static async runApiTest(testId: string): Promise<ApiTest> {
    const test = await pb.collection('api_tests').getOne(testId);
    const testData = this.mapApiTestRecord(test);
    
    try {
      const startTime = Date.now();
      const response = await fetch(testData.url, {
        method: testData.method,
        headers: testData.headers,
        body: testData.body ? JSON.stringify(testData.body) : undefined,
        signal: AbortSignal.timeout(testData.timeout)
      });
      
      const responseTime = Date.now() - startTime;
      const responseBody = await response.json().catch(() => null);
      
      const result = {
        status: response.status,
        responseTime,
        success: response.status === testData.expectedStatus,
        response: responseBody
      };
      
      const updatedRecord = await pb.collection('api_tests').update(testId, {
        lastRun: new Date().toISOString(),
        lastResult: result
      });
      
      return this.mapApiTestRecord(updatedRecord);
    } catch (error) {
      const result = {
        status: 0,
        responseTime: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      const updatedRecord = await pb.collection('api_tests').update(testId, {
        lastRun: new Date().toISOString(),
        lastResult: result
      });
      
      return this.mapApiTestRecord(updatedRecord);
    }
  }

  // API Collections
  static async createApiCollection(collectionData: Omit<ApiCollection, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, userId: string): Promise<ApiCollection> {
    const data = {
      ...collectionData,
      createdBy: userId,
      sharedWith: collectionData.sharedWith || []
    };
    
    const record = await pb.collection('api_collections').create(data);
    return this.mapApiCollectionRecord(record);
  }

  static async getApiCollectionsByApp(appId: string): Promise<ApiCollection[]> {
    const records = await pb.collection('api_collections').getList(1, 50, {
      filter: `appId = "${appId}"`,
      sort: '-created'
    });
    
    return records.items.map(this.mapApiCollectionRecord);
  }

  // API Sharing
  static async shareApi(shareData: Omit<ApiShare, 'id' | 'createdAt'>, userId: string): Promise<ApiShare> {
    const data = {
      ...shareData,
      sharedBy: userId
    };
    
    const record = await pb.collection('api_shares').create(data);
    return this.mapApiShareRecord(record);
  }

  static async getSharedApis(userId: string): Promise<ApiShare[]> {
    const records = await pb.collection('api_shares').getList(1, 50, {
      filter: `sharedWith = "${userId}"`,
      sort: '-created'
    });
    
    return records.items.map(this.mapApiShareRecord);
  }

  // Swagger Integration
  static async importSwaggerSpec(appId: string, swaggerUrl: string, userId: string): Promise<SwaggerSpec> {
    try {
      const response = await fetch(swaggerUrl);
      const swaggerData = await response.json();
      
      const endpoints: ApiEndpoint[] = [];
      
      // Parse OpenAPI/Swagger spec
      if (swaggerData.paths) {
        for (const [path, methods] of Object.entries(swaggerData.paths)) {
          for (const [method, operation] of Object.entries(methods as any)) {
            if (['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(method)) {
              const op = operation as any;
              endpoints.push({
                id: '', // Will be set by PocketBase
                appId,
                name: op.summary || op.operationId || `${method.toUpperCase()} ${path}`,
                description: op.description || '',
                path,
                method: method.toUpperCase() as any,
                category: 'public', // Default, can be updated later
                status: 'active',
                version: '1.0.0',
                authentication: 'none',
                rateLimit: 1000,
                responseTime: 0,
                lastTested: '',
                createdAt: '',
                updatedAt: '',
                createdBy: userId,
                tags: op.tags || [],
                documentation: {
                  summary: op.summary || '',
                  parameters: op.parameters?.map((p: any) => ({
                    name: p.name,
                    type: p.type || 'string',
                    required: p.required || false,
                    description: p.description || '',
                    defaultValue: p.default,
                    example: p.example
                  })) || [],
                  responses: Object.entries(op.responses || {}).map(([code, response]: [string, any]) => ({
                    code: parseInt(code),
                    description: response.description || '',
                    schema: response.schema,
                    example: response.example
                  })),
                  examples: []
                }
              });
            }
          }
        }
      }
      
      // Create swagger spec record
      const swaggerRecord = await pb.collection('swagger_specs').create({
        appId,
        version: swaggerData.info?.version || '1.0.0',
        title: swaggerData.info?.title || 'Imported API',
        description: swaggerData.info?.description || '',
        baseUrl: swaggerData.servers?.[0]?.url || '',
        endpoints: endpoints,
        createdBy: userId
      });
      
      // Create API endpoints
      for (const endpoint of endpoints) {
        await this.createApiEndpoint(endpoint, userId);
      }
      
      return this.mapSwaggerSpecRecord(swaggerRecord);
    } catch (error) {
      throw new Error(`Failed to import Swagger spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // App Onboarding
  static async onboardApp(onboardingData: AppOnboardingData, userId: string): Promise<{ app: App; apis: ApiEndpoint[] }> {
    // Create app
    const app = await this.createApp(onboardingData.app, userId);
    
    // Create initial APIs
    const apis: ApiEndpoint[] = [];
    for (const apiData of onboardingData.initialApis) {
      const api = await this.createApiEndpoint({
        ...apiData,
        appId: app.id
      }, userId);
      apis.push(api);
    }
    
    // Import Swagger if provided
    if (onboardingData.swaggerUrl) {
      await this.importSwaggerSpec(app.id, onboardingData.swaggerUrl, userId);
    }
    
    return { app, apis };
  }

  // Utility methods for mapping PocketBase records
  private static mapAppRecord(record: any): App {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      companyId: record.companyId,
      domain: record.domain,
      environment: record.environment,
      status: record.status,
      createdAt: record.created,
      updatedAt: record.updated,
      createdBy: record.createdBy,
      settings: record.settings
    };
  }

  private static mapApiEndpointRecord(record: any): ApiEndpoint {
    return {
      id: record.id,
      appId: record.appId,
      name: record.name,
      description: record.description,
      path: record.path,
      method: record.method,
      category: record.category,
      status: record.status,
      version: record.version,
      authentication: record.authentication,
      rateLimit: record.rateLimit,
      responseTime: record.responseTime,
      lastTested: record.lastTested,
      createdAt: record.created,
      updatedAt: record.updated,
      createdBy: record.createdBy,
      tags: record.tags || [],
      documentation: record.documentation || {
        summary: '',
        parameters: [],
        responses: [],
        examples: []
      }
    };
  }

  private static mapApiTestRecord(record: any): ApiTest {
    return {
      id: record.id,
      apiId: record.apiId,
      name: record.name,
      description: record.description,
      method: record.method,
      url: record.url,
      headers: record.headers || {},
      body: record.body,
      queryParams: record.queryParams || {},
      expectedStatus: record.expectedStatus,
      expectedResponse: record.expectedResponse,
      timeout: record.timeout,
      createdAt: record.created,
      updatedAt: record.updated,
      createdBy: record.createdBy,
      lastRun: record.lastRun,
      lastResult: record.lastResult
    };
  }

  private static mapApiCollectionRecord(record: any): ApiCollection {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      appId: record.appId,
      isPublic: record.isPublic,
      sharedWith: record.sharedWith || [],
      createdAt: record.created,
      updatedAt: record.updated,
      createdBy: record.createdBy,
      tests: [] // Will be populated separately if needed
    };
  }

  private static mapApiShareRecord(record: any): ApiShare {
    return {
      id: record.id,
      apiId: record.apiId,
      sharedBy: record.sharedBy,
      sharedWith: record.sharedWith,
      permissions: record.permissions,
      expiresAt: record.expiresAt,
      createdAt: record.created
    };
  }

  private static mapSwaggerSpecRecord(record: any): SwaggerSpec {
    return {
      id: record.id,
      appId: record.appId,
      version: record.version,
      title: record.title,
      description: record.description,
      baseUrl: record.baseUrl,
      endpoints: record.endpoints || [],
      createdAt: record.created,
      updatedAt: record.updated,
      createdBy: record.createdBy
    };
  }
}
