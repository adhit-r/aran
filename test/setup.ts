import { Database } from 'bun:sqlite'
import { join } from 'path'

// Global test setup
beforeAll(async () => {
  // Create test database
  const testDb = new Database(join(process.cwd(), 'test', 'test.db'))
  
  // Create test tables
  testDb.run(`
    CREATE TABLE IF NOT EXISTS test_companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT UNIQUE NOT NULL
    )
  `)

  testDb.run(`
    CREATE TABLE IF NOT EXISTS test_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      companyId TEXT NOT NULL
    )
  `)

  testDb.run(`
    CREATE TABLE IF NOT EXISTS test_api_endpoints (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      security TEXT NOT NULL,
      companyId TEXT NOT NULL
    )
  `)

  testDb.close()
})

// Global test cleanup
afterAll(async () => {
  // Clean up test database
  const testDb = new Database(join(process.cwd(), 'test', 'test.db'))
  testDb.run('DROP TABLE IF EXISTS test_companies')
  testDb.run('DROP TABLE IF EXISTS test_users')
  testDb.run('DROP TABLE IF EXISTS test_api_endpoints')
  testDb.close()
})

// Test utilities
export const createTestCompany = (db: Database, company: any) => {
  const insertCompany = db.prepare(`
    INSERT INTO test_companies (id, name, domain)
    VALUES (?, ?, ?)
  `)
  
  insertCompany.run(company.id, company.name, company.domain)
}

export const createTestUser = (db: Database, user: any) => {
  const insertUser = db.prepare(`
    INSERT INTO test_users (id, email, name, role, companyId)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  insertUser.run(user.id, user.email, user.name, user.role, user.companyId)
}

export const createTestApiEndpoint = (db: Database, endpoint: any) => {
  const insertEndpoint = db.prepare(`
    INSERT INTO test_api_endpoints (id, path, method, status, security, companyId)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  
  insertEndpoint.run(
    endpoint.id,
    endpoint.path,
    endpoint.method,
    endpoint.status,
    endpoint.security,
    endpoint.companyId
  )
}

export const getTestDatabase = () => {
  return new Database(join(process.cwd(), 'test', 'test.db'))
}
