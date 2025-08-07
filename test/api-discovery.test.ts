import { describe, it, expect, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { join } from 'path'
import { getTestDatabase, createTestCompany, createTestApiEndpoint } from './setup'

describe('API Discovery', () => {
  let db: Database

  beforeEach(() => {
    db = getTestDatabase()
    
    // Clear test data
    db.run('DELETE FROM test_companies')
    db.run('DELETE FROM test_api_endpoints')
    
    // Create test data
    createTestCompany(db, {
      id: 'company-1',
      name: 'TestCorp',
      domain: 'testcorp.com'
    })

    createTestApiEndpoint(db, {
      id: 'api-1',
      path: '/api/users',
      method: 'GET',
      status: 'active',
      security: 'secure',
      companyId: 'company-1'
    })

    createTestApiEndpoint(db, {
      id: 'api-2',
      path: '/api/auth/login',
      method: 'POST',
      status: 'active',
      security: 'insecure',
      companyId: 'company-1'
    })
  })

  describe('API Endpoint Discovery', () => {
    it('should discover all API endpoints for a company', () => {
      const endpoints = db.query(`
        SELECT * FROM test_api_endpoints 
        WHERE companyId = ?
      `).all('company-1')

      expect(endpoints).toHaveLength(2)
      expect(endpoints[0].path).toBe('/api/users')
      expect(endpoints[1].path).toBe('/api/auth/login')
    })

    it('should filter endpoints by security status', () => {
      const secureEndpoints = db.query(`
        SELECT * FROM test_api_endpoints 
        WHERE companyId = ? AND security = 'secure'
      `).all('company-1')

      const insecureEndpoints = db.query(`
        SELECT * FROM test_api_endpoints 
        WHERE companyId = ? AND security = 'insecure'
      `).all('company-1')

      expect(secureEndpoints).toHaveLength(1)
      expect(insecureEndpoints).toHaveLength(1)
      expect(secureEndpoints[0].path).toBe('/api/users')
      expect(insecureEndpoints[0].path).toBe('/api/auth/login')
    })

    it('should count endpoints by method', () => {
      const methodCounts = db.query(`
        SELECT method, COUNT(*) as count 
        FROM test_api_endpoints 
        WHERE companyId = ?
        GROUP BY method
      `).all('company-1')

      expect(methodCounts).toHaveLength(2)
      
      const getCount = methodCounts.find((m: any) => m.method === 'GET')
      const postCount = methodCounts.find((m: any) => m.method === 'POST')
      
      expect(getCount.count).toBe(1)
      expect(postCount.count).toBe(1)
    })
  })

  describe('Security Analysis', () => {
    it('should identify insecure endpoints', () => {
      const insecureEndpoints = db.query(`
        SELECT * FROM test_api_endpoints 
        WHERE companyId = ? AND security = 'insecure'
      `).all('company-1')

      expect(insecureEndpoints).toHaveLength(1)
      expect(insecureEndpoints[0].path).toBe('/api/auth/login')
    })

    it('should calculate security score', () => {
      const totalEndpoints = db.query(`
        SELECT COUNT(*) as total FROM test_api_endpoints WHERE companyId = ?
      `).get('company-1').total

      const secureEndpoints = db.query(`
        SELECT COUNT(*) as secure FROM test_api_endpoints 
        WHERE companyId = ? AND security = 'secure'
      `).get('company-1').secure

      const securityScore = (secureEndpoints / totalEndpoints) * 100

      expect(securityScore).toBe(50) // 1 out of 2 endpoints are secure
    })
  })

  describe('Performance', () => {
    it('should handle large number of endpoints efficiently', () => {
      // Insert 1000 test endpoints
      const insertEndpoint = db.prepare(`
        INSERT INTO test_api_endpoints (id, path, method, status, security, companyId)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        insertEndpoint.run(
          `api-perf-${i}`, // Use unique IDs
          `/api/test/${i}`,
          'GET',
          'active',
          'secure',
          'company-1'
        )
      }

      const end = performance.now()
      const duration = end - start

      // Should complete within 1 second
      expect(duration).toBeLessThan(1000)

      // Verify all endpoints were inserted
      const count = db.query(`
        SELECT COUNT(*) as count FROM test_api_endpoints WHERE companyId = ?
      `).get('company-1').count

      expect(count).toBe(1002) // 2 original + 1000 new
    })
  })
})
