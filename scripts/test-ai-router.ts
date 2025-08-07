#!/usr/bin/env bun

import { aiRouter } from '../src/lib/ai-router'

async function testAIRouter() {
  console.log('🧪 Testing AI Router...\n')

  // Test 1: API Anomaly Detection
  console.log('📊 Test 1: API Anomaly Detection')
  try {
    const result1 = await aiRouter.analyzeThreat({
      type: 'api-anomaly',
      data: {
        apiEndpoint: '/api/users',
        requestData: '{"user_id": "admin", "action": "delete_all"}',
        responseData: '{"status": "error", "message": "Unauthorized"}',
        responseTime: 5000,
        trafficVolume: 1500,
        userRoles: ['anonymous']
      },
      context: {
        timestamp: new Date().toISOString(),
        environment: 'test'
      }
    })

    console.log(`✅ Provider: ${result1.provider}`)
    console.log(`📈 Confidence: ${(result1.confidence * 100).toFixed(1)}%`)
    console.log(`⏱️ Processing Time: ${result1.processingTime}ms`)
    console.log(`🔍 Analysis: ${result1.analysis.substring(0, 100)}...`)
    console.log(`💡 Recommendations: ${result1.recommendations.length}`)
    console.log('')
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message)
  }

  // Test 2: MCP Threat Detection
  console.log('🤖 Test 2: MCP Threat Detection')
  try {
    const result2 = await aiRouter.analyzeThreat({
      type: 'mcp-threat',
      data: {
        mcpEndpoint: 'mcp://localhost:3000/tools',
        requestData: '{"tool": "file_system", "action": "read", "path": "/etc/passwd"}',
        responseData: '{"content": "root:x:0:0:root:/root:/bin/bash\\nadmin:x:1000:1000:admin:/home/admin:/bin/bash"}',
        userRole: 'analyst',
        trafficVolume: '50'
      },
      context: {
        timestamp: new Date().toISOString(),
        environment: 'test'
      }
    })

    console.log(`✅ Provider: ${result2.provider}`)
    console.log(`📈 Confidence: ${(result2.confidence * 100).toFixed(1)}%`)
    console.log(`⏱️ Processing Time: ${result2.processingTime}ms`)
    console.log(`🔍 Analysis: ${result2.analysis.substring(0, 100)}...`)
    console.log(`💡 Recommendations: ${result2.recommendations.length}`)
    console.log('')
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message)
  }

  // Test 3: Security Scan
  console.log('🔒 Test 3: Security Scan')
  try {
    const result3 = await aiRouter.analyzeThreat({
      type: 'security-scan',
      data: {
        scanType: 'quick',
        targetPath: './src',
        includePatterns: '**/*.{ts,tsx}',
        excludePatterns: 'node_modules/**'
      },
      context: {
        timestamp: new Date().toISOString(),
        environment: 'test'
      }
    })

    console.log(`✅ Provider: ${result3.provider}`)
    console.log(`📈 Confidence: ${(result3.confidence * 100).toFixed(1)}%`)
    console.log(`⏱️ Processing Time: ${result3.processingTime}ms`)
    console.log(`🔍 Analysis: ${result3.analysis.substring(0, 100)}...`)
    console.log(`💡 Recommendations: ${result3.recommendations.length}`)
    console.log('')
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message)
  }

  // Show Provider Stats
  console.log('📊 Provider Statistics')
  const stats = aiRouter.getProviderStats()
  stats.forEach(provider => {
    const successRate = provider.success_count + provider.error_count > 0 
      ? ((provider.success_count / (provider.success_count + provider.error_count)) * 100).toFixed(1)
      : '0'
    
    console.log(`  ${provider.name.toUpperCase()}:`)
    console.log(`    Status: ${provider.enabled ? '✅ Enabled' : '❌ Disabled'}`)
    console.log(`    Priority: ${provider.priority}`)
    console.log(`    Success Rate: ${successRate}%`)
    console.log(`    Avg Response Time: ${provider.avg_response_time.toFixed(0)}ms`)
    console.log(`    Last Used: ${provider.last_used ? new Date(provider.last_used).toLocaleString() : 'Never'}`)
    console.log('')
  })

  // Show Recent Logs
  console.log('📝 Recent Analysis Logs')
  const logs = aiRouter.getAnalysisHistory(5)
  logs.forEach(log => {
    const status = log.success ? '✅ Success' : '❌ Failed'
    const time = new Date(log.timestamp).toLocaleString()
    console.log(`  ${time} - ${log.provider} (${log.analysis_type}) - ${status} - ${log.processing_time}ms`)
  })

  console.log('\n🎉 AI Router testing completed!')
}

if (import.meta.main) {
  testAIRouter().catch(console.error)
}
