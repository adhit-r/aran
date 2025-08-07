#!/usr/bin/env bun

import { serve } from 'bun'
import { Database } from 'bun:sqlite'
import { join } from 'path'

interface PerformanceMetric {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  timestamp: string
  memoryUsage: number
  cpuUsage: number
}

interface PerformanceReport {
  testId: string
  timestamp: string
  duration: number
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  throughput: number
  metrics: PerformanceMetric[]
  recommendations: string[]
}

class PerformanceTester {
  private metrics: PerformanceMetric[] = []
  private testId: string
  private startTime: number

  constructor() {
    this.testId = `perf-${Date.now()}`
    this.startTime = Date.now()
  }

  async runLoadTest(endpoints: string[], duration: number = 60000): Promise<PerformanceReport> {
    console.log('🚀 Starting performance test...')
    console.log(`📊 Testing ${endpoints.length} endpoints for ${duration / 1000} seconds`)

    const promises = endpoints.map(endpoint => this.testEndpoint(endpoint, duration))
    await Promise.all(promises)

    const endTime = Date.now()
    const totalDuration = endTime - this.startTime

    return this.generateReport(totalDuration)
  }

  private async testEndpoint(endpoint: string, duration: number): Promise<void> {
    const startTime = Date.now()
    const endTime = startTime + duration
    const interval = 1000 // 1 request per second

    while (Date.now() < endTime) {
      try {
        const start = performance.now()
        const response = await fetch(`http://localhost:9002${endpoint}`)
        const end = performance.now()
        
        const metric: PerformanceMetric = {
          endpoint,
          method: 'GET',
          responseTime: end - start,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
          cpuUsage: process.cpuUsage().user / 1000000 // seconds
        }

        this.metrics.push(metric)

        // Wait for next interval
        await new Promise(resolve => setTimeout(resolve, interval))
      } catch (error) {
        console.error(`❌ Error testing ${endpoint}:`, error)
      }
    }
  }

  private generateReport(duration: number): PerformanceReport {
    const successfulRequests = this.metrics.filter(m => m.statusCode >= 200 && m.statusCode < 300)
    const failedRequests = this.metrics.filter(m => m.statusCode >= 400)
    
    const responseTimes = this.metrics.map(m => m.responseTime)
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const minResponseTime = Math.min(...responseTimes)
    const maxResponseTime = Math.max(...responseTimes)
    
    const throughput = this.metrics.length / (duration / 1000) // requests per second

    const recommendations = this.generateRecommendations(averageResponseTime, throughput)

    return {
      testId: this.testId,
      timestamp: new Date().toISOString(),
      duration,
      totalRequests: this.metrics.length,
      successfulRequests: successfulRequests.length,
      failedRequests: failedRequests.length,
      averageResponseTime,
      minResponseTime,
      maxResponseTime,
      throughput,
      metrics: this.metrics,
      recommendations
    }
  }

  private generateRecommendations(averageResponseTime: number, throughput: number): string[] {
    const recommendations = []

    if (averageResponseTime > 1000) {
      recommendations.push('Consider optimizing database queries and implementing caching')
    }

    if (averageResponseTime > 500) {
      recommendations.push('Implement response compression and optimize bundle size')
    }

    if (throughput < 10) {
      recommendations.push('Consider horizontal scaling and load balancing')
    }

    if (this.metrics.some(m => m.statusCode >= 500)) {
      recommendations.push('Investigate and fix server errors')
    }

    if (this.metrics.some(m => m.memoryUsage > 100)) {
      recommendations.push('Monitor memory usage and implement garbage collection optimization')
    }

    return recommendations
  }

  async saveReport(report: PerformanceReport): Promise<void> {
    const db = new Database(join(process.cwd(), 'data', 'performance.db'))
    
    db.run(`
      CREATE TABLE IF NOT EXISTS performance_reports (
        testId TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        report TEXT NOT NULL
      )
    `)

    const insertReport = db.prepare(`
      INSERT OR REPLACE INTO performance_reports (testId, timestamp, report)
      VALUES (?, ?, ?)
    `)

    insertReport.run(
      report.testId,
      report.timestamp,
      JSON.stringify(report)
    )

    db.close()
  }

  async runDatabasePerformanceTest(): Promise<void> {
    console.log('🗄️ Testing database performance...')
    
    const db = new Database(join(process.cwd(), 'data', 'aran.db'))
    
    // Test query performance
    const start = performance.now()
    const result = db.query('SELECT * FROM api_endpoints LIMIT 1000').all()
    const end = performance.now()
    
    console.log(`📊 Database query performance: ${end - start}ms for 1000 records`)
    
    // Test insert performance
    const insertStart = performance.now()
    const insertStmt = db.prepare('INSERT INTO api_endpoints (id, path, method, status, security, companyId, lastSeen, traffic, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    
    for (let i = 0; i < 100; i++) {
      insertStmt.run(
        `test-${i}`,
        `/api/test/${i}`,
        'GET',
        'active',
        'secure',
        'company-1',
        new Date().toISOString(),
        Math.floor(Math.random() * 1000),
        new Date().toISOString(),
        new Date().toISOString()
      )
    }
    
    const insertEnd = performance.now()
    console.log(`📊 Database insert performance: ${insertEnd - insertStart}ms for 100 records`)
    
    db.close()
  }

  async runMemoryTest(): Promise<void> {
    console.log('🧠 Testing memory usage...')
    
    const initialMemory = process.memoryUsage()
    console.log(`📊 Initial memory usage: ${initialMemory.heapUsed / 1024 / 1024}MB`)
    
    // Simulate memory-intensive operations
    const largeArray = new Array(1000000).fill('test')
    const afterArrayMemory = process.memoryUsage()
    console.log(`📊 Memory after large array: ${afterArrayMemory.heapUsed / 1024 / 1024}MB`)
    
    // Clear array to test garbage collection
    largeArray.length = 0
    const afterClearMemory = process.memoryUsage()
    console.log(`📊 Memory after clearing: ${afterClearMemory.heapUsed / 1024 / 1024}MB`)
  }
}

async function main() {
  const tester = new PerformanceTester()
  
  // Test endpoints
  const endpoints = [
    '/dashboard',
    '/api-discovery',
    '/threat-detection',
    '/api-catalog',
    '/mcp-security'
  ]

  console.log('🎯 Starting comprehensive performance test...')
  
  // Run load test
  const report = await tester.runLoadTest(endpoints, 30000) // 30 seconds
  
  // Run database performance test
  await tester.runDatabasePerformanceTest()
  
  // Run memory test
  await tester.runMemoryTest()
  
  console.log('\n📊 Performance Test Report')
  console.log('==========================')
  console.log(`Test ID: ${report.testId}`)
  console.log(`Duration: ${report.duration / 1000}s`)
  console.log(`Total Requests: ${report.totalRequests}`)
  console.log(`Successful: ${report.successfulRequests}`)
  console.log(`Failed: ${report.failedRequests}`)
  console.log(`Average Response Time: ${report.averageResponseTime.toFixed(2)}ms`)
  console.log(`Min Response Time: ${report.minResponseTime.toFixed(2)}ms`)
  console.log(`Max Response Time: ${report.maxResponseTime.toFixed(2)}ms`)
  console.log(`Throughput: ${report.throughput.toFixed(2)} req/s`)

  console.log('\n💡 Recommendations:')
  report.recommendations.forEach(rec => {
    console.log(`  • ${rec}`)
  })

  await tester.saveReport(report)
  console.log('\n✅ Performance test completed and report saved!')
}

if (import.meta.main) {
  main().catch(console.error)
}
