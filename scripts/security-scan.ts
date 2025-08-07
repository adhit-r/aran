#!/usr/bin/env bun

import { Database } from 'bun:sqlite'
import { join } from 'path'
import { readdir, readFile } from 'fs/promises'
import { glob } from 'glob'

interface SecurityVulnerability {
  id: string
  type: 'sql-injection' | 'xss' | 'csrf' | 'auth-bypass' | 'data-exposure'
  severity: 'low' | 'medium' | 'high' | 'critical'
  file: string
  line: number
  description: string
  recommendation: string
  cwe?: string
}

interface SecurityReport {
  scanId: string
  timestamp: string
  vulnerabilities: SecurityVulnerability[]
  summary: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
  }
  recommendations: string[]
}

class SecurityScanner {
  private vulnerabilities: SecurityVulnerability[] = []
  private scanId: string

  constructor() {
    this.scanId = `scan-${Date.now()}`
  }

  async scanCodebase(): Promise<SecurityReport> {
    console.log('🔍 Starting security scan...')

    // Scan for common security issues
    await this.scanForSqlInjection()
    await this.scanForXss()
    await this.scanForAuthIssues()
    await this.scanForDataExposure()
    await this.scanForDependencies()

    const summary = this.calculateSummary()
    const recommendations = this.generateRecommendations()

    return {
      scanId: this.scanId,
      timestamp: new Date().toISOString(),
      vulnerabilities: this.vulnerabilities,
      summary,
      recommendations
    }
  }

  private async scanForSqlInjection(): Promise<void> {
    console.log('🔍 Scanning for SQL injection vulnerabilities...')
    
    const patterns = [
      'SELECT * FROM',
      'INSERT INTO',
      'UPDATE',
      'DELETE FROM',
      'WHERE id =',
      'WHERE email ='
    ]

    const files = await glob('src/**/*.{ts,tsx,js,jsx}')
    
    for (const file of files) {
      try {
        const content = await readFile(file, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          
          for (const pattern of patterns) {
            if (line.includes(pattern) && !line.includes('prepared') && !line.includes('parameterized')) {
              this.vulnerabilities.push({
                id: `sql-${this.scanId}-${i}`,
                type: 'sql-injection',
                severity: 'high',
                file,
                line: i + 1,
                description: `Potential SQL injection vulnerability detected`,
                recommendation: 'Use parameterized queries or prepared statements',
                cwe: 'CWE-89'
              })
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not scan file: ${file}`)
      }
    }
  }

  private async scanForXss(): Promise<void> {
    console.log('🔍 Scanning for XSS vulnerabilities...')
    
    const patterns = [
      'dangerouslySetInnerHTML',
      'innerHTML',
      'document.write',
      'eval(',
      'innerHTML ='
    ]

    const files = await glob('src/**/*.{ts,tsx,js,jsx}')
    
    for (const file of files) {
      try {
        const content = await readFile(file, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          
          for (const pattern of patterns) {
            if (line.includes(pattern)) {
              this.vulnerabilities.push({
                id: `xss-${this.scanId}-${i}`,
                type: 'xss',
                severity: 'medium',
                file,
                line: i + 1,
                description: `Potential XSS vulnerability detected`,
                recommendation: 'Sanitize user input and avoid dangerous DOM manipulation',
                cwe: 'CWE-79'
              })
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not scan file: ${file}`)
      }
    }
  }

  private async scanForAuthIssues(): Promise<void> {
    console.log('🔍 Scanning for authentication vulnerabilities...')
    
    const patterns = [
      'password',
      'token',
      'secret',
      'api_key',
      'private_key'
    ]

    const files = await glob('src/**/*.{ts,tsx,js,jsx}')
    
    for (const file of files) {
      try {
        const content = await readFile(file, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          
          for (const pattern of patterns) {
            if (line.includes(pattern) && !line.includes('//') && !line.includes('/*')) {
              this.vulnerabilities.push({
                id: `auth-${this.scanId}-${i}`,
                type: 'auth-bypass',
                severity: 'critical',
                file,
                line: i + 1,
                description: `Potential hardcoded credentials detected`,
                recommendation: 'Use environment variables for sensitive data',
                cwe: 'CWE-259'
              })
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not scan file: ${file}`)
      }
    }
  }

  private async scanForDataExposure(): Promise<void> {
    console.log('🔍 Scanning for data exposure vulnerabilities...')
    
    const patterns = [
      'console.log',
      'console.error',
      'console.warn',
      'console.info',
      'debug(',
      'print('
    ]

    const files = await glob('src/**/*.{ts,tsx,js,jsx}')
    
    for (const file of files) {
      try {
        const content = await readFile(file, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          
          for (const pattern of patterns) {
            if (line.includes(pattern) && !line.includes('// TODO: Remove')) {
              this.vulnerabilities.push({
                id: `data-${this.scanId}-${i}`,
                type: 'data-exposure',
                severity: 'low',
                file,
                line: i + 1,
                description: `Potential data exposure through logging`,
                recommendation: 'Remove debug statements in production',
                cwe: 'CWE-532'
              })
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not scan file: ${file}`)
      }
    }
  }

  private async scanForDependencies(): Promise<void> {
    console.log('🔍 Scanning for vulnerable dependencies...')
    
    try {
      const packageJson = JSON.parse(await readFile('package.json', 'utf-8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      // Check for known vulnerable packages
      const vulnerablePackages = [
        'lodash',
        'moment',
        'jquery',
        'express'
      ]
      
      for (const pkg of vulnerablePackages) {
        if (dependencies[pkg]) {
          this.vulnerabilities.push({
            id: `dep-${this.scanId}-${pkg}`,
            type: 'data-exposure',
            severity: 'medium',
            file: 'package.json',
            line: 1,
            description: `Potentially vulnerable dependency: ${pkg}`,
            recommendation: `Update ${pkg} to latest version or consider alternatives`,
            cwe: 'CWE-937'
          })
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not scan package.json')
    }
  }

  private calculateSummary() {
    const summary = {
      total: this.vulnerabilities.length,
      critical: this.vulnerabilities.filter(v => v.severity === 'critical').length,
      high: this.vulnerabilities.filter(v => v.severity === 'high').length,
      medium: this.vulnerabilities.filter(v => v.severity === 'medium').length,
      low: this.vulnerabilities.filter(v => v.severity === 'low').length
    }

    return summary
  }

  private generateRecommendations(): string[] {
    const recommendations = []

    if (this.vulnerabilities.some(v => v.type === 'sql-injection')) {
      recommendations.push('Implement parameterized queries for all database operations')
    }

    if (this.vulnerabilities.some(v => v.type === 'xss')) {
      recommendations.push('Sanitize all user inputs and implement Content Security Policy')
    }

    if (this.vulnerabilities.some(v => v.type === 'auth-bypass')) {
      recommendations.push('Move all sensitive data to environment variables')
    }

    if (this.vulnerabilities.some(v => v.type === 'data-exposure')) {
      recommendations.push('Remove debug statements and implement proper logging')
    }

    if (this.vulnerabilities.length > 0) {
      recommendations.push('Consider implementing automated security testing in CI/CD')
    }

    return recommendations
  }

  async saveReport(report: SecurityReport): Promise<void> {
    const db = new Database(join(process.cwd(), 'data', 'security.db'))
    
    db.run(`
      CREATE TABLE IF NOT EXISTS security_reports (
        scanId TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        report TEXT NOT NULL
      )
    `)

    const insertReport = db.prepare(`
      INSERT OR REPLACE INTO security_reports (scanId, timestamp, report)
      VALUES (?, ?, ?)
    `)

    insertReport.run(
      report.scanId,
      report.timestamp,
      JSON.stringify(report)
    )

    db.close()
  }
}

async function main() {
  const scanner = new SecurityScanner()
  const report = await scanner.scanCodebase()
  
  console.log('\n📊 Security Scan Report')
  console.log('========================')
  console.log(`Scan ID: ${report.scanId}`)
  console.log(`Timestamp: ${report.timestamp}`)
  console.log(`Total Vulnerabilities: ${report.summary.total}`)
  console.log(`Critical: ${report.summary.critical}`)
  console.log(`High: ${report.summary.high}`)
  console.log(`Medium: ${report.summary.medium}`)
  console.log(`Low: ${report.summary.low}`)

  if (report.vulnerabilities.length > 0) {
    console.log('\n🚨 Vulnerabilities Found:')
    report.vulnerabilities.forEach(vuln => {
      console.log(`  ${vuln.severity.toUpperCase()}: ${vuln.description}`)
      console.log(`    File: ${vuln.file}:${vuln.line}`)
      console.log(`    Recommendation: ${vuln.recommendation}`)
      console.log('')
    })
  }

  console.log('\n💡 Recommendations:')
  report.recommendations.forEach(rec => {
    console.log(`  • ${rec}`)
  })

  await scanner.saveReport(report)
  console.log('\n✅ Security scan completed and report saved!')
}

if (import.meta.main) {
  main().catch(console.error)
}
