#!/usr/bin/env bun

import { Database } from 'bun:sqlite'
import { join } from 'path'

// AI Provider Types
export type AIProvider = 'ollama' | 'openai' | 'gemini' | 'anthropic' | 'rule-based'

export interface AIAnalysisResult {
  provider: AIProvider
  confidence: number
  analysis: string
  recommendations: string[]
  processingTime: number
  cost?: number
}

export interface AIProviderConfig {
  name: AIProvider
  enabled: boolean
  priority: number
  apiKey?: string
  baseUrl?: string
  model?: string
  maxTokens?: number
  timeout?: number
}

export class AIRouter {
  private providers: Map<AIProvider, AIProviderConfig> = new Map()
  private db: Database

  constructor() {
    this.db = new Database(join(process.cwd(), 'data', 'ai-providers.db'))
    this.initializeDatabase()
    this.loadProviders()
  }

  private initializeDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ai_providers (
        name TEXT PRIMARY KEY,
        enabled BOOLEAN NOT NULL DEFAULT 1,
        priority INTEGER NOT NULL DEFAULT 0,
        api_key TEXT,
        base_url TEXT,
        model TEXT,
        max_tokens INTEGER,
        timeout INTEGER,
        last_used TEXT,
        success_count INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        avg_response_time REAL DEFAULT 0
      )
    `)

    this.db.run(`
      CREATE TABLE IF NOT EXISTS ai_analysis_logs (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        analysis_type TEXT NOT NULL,
        input_data TEXT,
        result TEXT,
        processing_time REAL,
        success BOOLEAN,
        error_message TEXT,
        timestamp TEXT NOT NULL
      )
    `)
  }

  private loadProviders() {
    // Load from database
    const providers = this.db.query('SELECT * FROM ai_providers ORDER BY priority DESC').all()
    
    for (const provider of providers) {
      this.providers.set(provider.name as AIProvider, {
        name: provider.name as AIProvider,
        enabled: provider.enabled === 1,
        priority: provider.priority,
        apiKey: provider.api_key,
        baseUrl: provider.base_url,
        model: provider.model,
        maxTokens: provider.max_tokens,
        timeout: provider.timeout
      })
    }

    // Initialize default providers if none exist
    if (providers.length === 0) {
      this.initializeDefaultProviders()
    }
  }

  private initializeDefaultProviders() {
    const defaultProviders: AIProviderConfig[] = [
      {
        name: 'ollama',
        enabled: true,
        priority: 1,
        model: 'llama2',
        timeout: 30000
      },
      {
        name: 'openai',
        enabled: true,
        priority: 2,
        model: 'gpt-4',
        maxTokens: 1000,
        timeout: 30000
      },
      {
        name: 'gemini',
        enabled: true,
        priority: 3,
        model: 'gemini-pro',
        maxTokens: 1000,
        timeout: 30000
      },
      {
        name: 'anthropic',
        enabled: true,
        priority: 4,
        model: 'claude-3-sonnet',
        maxTokens: 1000,
        timeout: 30000
      },
      {
        name: 'rule-based',
        enabled: true,
        priority: 5,
        timeout: 1000
      }
    ]

    for (const provider of defaultProviders) {
      this.addProvider(provider)
    }
  }

  public addProvider(config: AIProviderConfig) {
    this.providers.set(config.name, config)
    
    this.db.prepare(`
      INSERT OR REPLACE INTO ai_providers 
      (name, enabled, priority, api_key, base_url, model, max_tokens, timeout)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      config.name,
      config.enabled ? 1 : 0,
      config.priority,
      config.apiKey || null,
      config.baseUrl || null,
      config.model || null,
      config.maxTokens || null,
      config.timeout || 30000
    )
  }

  public async analyzeThreat(input: {
    type: 'api-anomaly' | 'mcp-threat' | 'security-scan'
    data: any
    context?: any
  }): Promise<AIAnalysisResult> {
    const startTime = Date.now()
    
    // Get available providers sorted by priority
    const availableProviders = Array.from(this.providers.values())
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority)

    for (const provider of availableProviders) {
      try {
        const result = await this.analyzeWithProvider(provider, input)
        const processingTime = Date.now() - startTime
        
        // Log successful analysis
        this.logAnalysis(provider.name, input.type, input.data, result, processingTime, true)
        
        // Update provider stats
        this.updateProviderStats(provider.name, processingTime, true)
        
        return {
          provider: provider.name,
          confidence: result.confidence || 0.8,
          analysis: result.analysis || 'Analysis completed',
          recommendations: result.recommendations || [],
          processingTime,
          cost: result.cost
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error.message)
        
        // Log failed analysis
        this.logAnalysis(provider.name, input.type, input.data, null, 0, false, error.message)
        
        // Update provider stats
        this.updateProviderStats(provider.name, 0, false)
        
        // Continue to next provider
        continue
      }
    }

    // Fallback to rule-based analysis
    const fallbackResult = await this.analyzeWithRuleBased(input)
    const processingTime = Date.now() - startTime
    
    return {
      provider: 'rule-based',
      confidence: 0.6,
      analysis: fallbackResult.analysis || 'Rule-based analysis completed',
      recommendations: fallbackResult.recommendations || [],
      processingTime
    }
  }

  private async analyzeWithProvider(provider: AIProviderConfig, input: any): Promise<any> {
    switch (provider.name) {
      case 'ollama':
        return await this.analyzeWithOllama(provider, input)
      case 'openai':
        return await this.analyzeWithOpenAI(provider, input)
      case 'gemini':
        return await this.analyzeWithGemini(provider, input)
      case 'anthropic':
        return await this.analyzeWithAnthropic(provider, input)
      case 'rule-based':
        return await this.analyzeWithRuleBased(input)
      default:
        throw new Error(`Unknown provider: ${provider.name}`)
    }
  }

  private async analyzeWithOllama(provider: AIProviderConfig, input: any): Promise<any> {
    try {
      // Check if Ollama is available locally
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (!response.ok) {
        throw new Error('Ollama not available')
      }

      const models = await response.json()
      const modelName = provider.model || 'llama2'
      
      // Check if model is available
      const modelAvailable = models.models?.some((m: any) => m.name.includes(modelName))
      if (!modelAvailable) {
        throw new Error(`Model ${modelName} not available in Ollama`)
      }

      // Perform analysis with Ollama
      const prompt = this.buildPrompt(input)
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt,
          stream: false,
          options: {
            temperature: 0.1,
            top_p: 0.9,
            max_tokens: provider.maxTokens || 1000
          }
        })
      })

      if (!ollamaResponse.ok) {
        throw new Error('Ollama API request failed')
      }

      const result = await ollamaResponse.json()
      return this.parseAIResponse(result.response, input.type)

    } catch (error) {
      throw new Error(`Ollama analysis failed: ${error.message}`)
    }
  }

  private async analyzeWithOpenAI(provider: AIProviderConfig, input: any): Promise<any> {
    if (!provider.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const prompt = this.buildPrompt(input)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: provider.model || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a cybersecurity expert specializing in API security and threat detection.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: provider.maxTokens || 1000,
          temperature: 0.1
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const result = await response.json()
      const analysis = result.choices[0]?.message?.content
      
      return this.parseAIResponse(analysis, input.type)

    } catch (error) {
      throw new Error(`OpenAI analysis failed: ${error.message}`)
    }
  }

  private async analyzeWithGemini(provider: AIProviderConfig, input: any): Promise<any> {
    if (!provider.apiKey) {
      throw new Error('Gemini API key not configured')
    }

    try {
      const prompt = this.buildPrompt(input)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.model || 'gemini-pro'}:generateContent?key=${provider.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: provider.maxTokens || 1000,
            temperature: 0.1
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const result = await response.json()
      const analysis = result.candidates[0]?.content?.parts[0]?.text
      
      return this.parseAIResponse(analysis, input.type)

    } catch (error) {
      throw new Error(`Gemini analysis failed: ${error.message}`)
    }
  }

  private async analyzeWithAnthropic(provider: AIProviderConfig, input: any): Promise<any> {
    if (!provider.apiKey) {
      throw new Error('Anthropic API key not configured')
    }

    try {
      const prompt = this.buildPrompt(input)
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: provider.model || 'claude-3-sonnet-20240229',
          max_tokens: provider.maxTokens || 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`)
      }

      const result = await response.json()
      const analysis = result.content[0]?.text
      
      return this.parseAIResponse(analysis, input.type)

    } catch (error) {
      throw new Error(`Anthropic analysis failed: ${error.message}`)
    }
  }

  private async analyzeWithRuleBased(input: any): Promise<any> {
    // Import rule-based analysis
    const { detectApiAnomaly } = await import('./ai-utils')
    
    if (input.type === 'api-anomaly') {
      return await detectApiAnomaly(input.data)
    } else if (input.type === 'mcp-threat') {
      const { detectMcpThreats } = await import('./mcp-utils')
      return await detectMcpThreats(input.data)
    } else {
      return {
        analysis: 'Rule-based analysis completed',
        recommendations: ['Continue monitoring', 'Review security policies']
      }
    }
  }

  private buildPrompt(input: any): string {
    const basePrompt = `You are a cybersecurity expert analyzing ${input.type} data. 
    
Input Data:
${JSON.stringify(input.data, null, 2)}

Context:
${JSON.stringify(input.context || {}, null, 2)}

Please provide:
1. A detailed analysis of potential threats
2. Specific recommendations for mitigation
3. Confidence level in your assessment
4. Priority level for each recommendation

Format your response as JSON with the following structure:
{
  "analysis": "detailed threat analysis",
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence": 0.85,
  "threatLevel": "high|medium|low"
}`

    return basePrompt
  }

  private parseAIResponse(response: string, type: string): any {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      // Fallback to text parsing
      return {
        analysis: response,
        recommendations: this.extractRecommendations(response),
        confidence: 0.7,
        threatLevel: this.extractThreatLevel(response)
      }
    } catch (error) {
      return {
        analysis: response,
        recommendations: ['Review the analysis manually'],
        confidence: 0.5,
        threatLevel: 'medium'
      }
    }
  }

  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('should') || line.includes('need to')) {
        recommendations.push(line.trim())
      }
    }
    
    return recommendations.length > 0 ? recommendations : ['Review security policies']
  }

  private extractThreatLevel(text: string): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('high') || lowerText.includes('critical') || lowerText.includes('severe')) {
      return 'high'
    } else if (lowerText.includes('medium') || lowerText.includes('moderate')) {
      return 'medium'
    } else {
      return 'low'
    }
  }

  private logAnalysis(provider: string, type: string, input: any, result: any, processingTime: number, success: boolean, error?: string) {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    this.db.prepare(`
      INSERT INTO ai_analysis_logs 
      (id, provider, analysis_type, input_data, result, processing_time, success, error_message, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      logId,
      provider,
      type,
      JSON.stringify(input),
      result ? JSON.stringify(result) : null,
      processingTime,
      success ? 1 : 0,
      error || null,
      new Date().toISOString()
    )
  }

  private updateProviderStats(provider: string, processingTime: number, success: boolean) {
    const current = this.db.query('SELECT success_count, error_count, avg_response_time FROM ai_providers WHERE name = ?').get(provider)
    
    if (current) {
      const newSuccessCount = current.success_count + (success ? 1 : 0)
      const newErrorCount = current.error_count + (success ? 0 : 1)
      const newAvgTime = success ? 
        ((current.avg_response_time * current.success_count + processingTime) / newSuccessCount) : 
        current.avg_response_time

      this.db.prepare(`
        UPDATE ai_providers 
        SET success_count = ?, error_count = ?, avg_response_time = ?, last_used = ?
        WHERE name = ?
      `).run(newSuccessCount, newErrorCount, newAvgTime, new Date().toISOString(), provider)
    }
  }

  public getProviderStats(): any {
    return this.db.query('SELECT * FROM ai_providers ORDER BY priority').all()
  }

  public getAnalysisHistory(limit: number = 50): any {
    return this.db.query(`
      SELECT * FROM ai_analysis_logs 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit)
  }
}

// Export singleton instance
export const aiRouter = new AIRouter()
