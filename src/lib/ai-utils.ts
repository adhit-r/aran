/**
 * Local AI utilities for API analysis without external dependencies
 * Provides rule-based analysis and pattern matching for API discovery and threat detection
 */

import { z } from 'zod';

// Types for API discovery
export const DiscoverApisInputSchema = z.object({
  trafficData: z.string().describe('API traffic data for analysis'),
});

export const DiscoverApisOutputSchema = z.object({
  discoveredApis: z.array(z.object({
    endpoint: z.string().describe('The API endpoint URL'),
    category: z.string().describe('The category of the API'),
    description: z.string().describe('A brief description of the API'),
    securityProtocols: z.string().describe('The security protocols used by the API'),
  })).describe('A list of discovered APIs with their metadata'),
});

export type DiscoverApisInput = z.infer<typeof DiscoverApisInputSchema>;
export type DiscoverApisOutput = z.infer<typeof DiscoverApisOutputSchema>;

// Types for threat detection
export const DetectApiAnomalyInputSchema = z.object({
  apiEndpoint: z.string().describe('The API endpoint being monitored'),
  requestData: z.string().describe('The API request data in JSON format'),
  responseData: z.string().describe('The API response data in JSON format'),
  responseTime: z.number().describe('The API response time in milliseconds'),
  trafficVolume: z.number().describe('The number of requests to the API endpoint in the last minute'),
  userRoles: z.array(z.string()).describe('Roles of the user making the API call'),
});

export const DetectApiAnomalyOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the API traffic is anomalous'),
  anomalyScore: z.number().describe('A score indicating the severity of the anomaly (0-1)'),
  threatLevel: z.enum(['low', 'medium', 'high']).describe('The threat level of the anomaly'),
  explanation: z.string().describe('An explanation of why the API traffic is considered anomalous'),
  suggestedActions: z.string().describe('Suggested actions to take in response to the anomaly'),
});

export type DetectApiAnomalyInput = z.infer<typeof DetectApiAnomalyInputSchema>;
export type DetectApiAnomalyOutput = z.infer<typeof DetectApiAnomalyOutputSchema>;

/**
 * Rule-based API discovery using pattern matching
 */
export async function discoverApis(input: DiscoverApisInput): Promise<DiscoverApisOutput> {
  const { trafficData } = input;
  const discoveredApis: DiscoverApisOutput['discoveredApis'] = [];

  // Pattern matching for common API endpoints
  const urlPattern = /https?:\/\/[^\s]+/g;
  const paths = trafficData.match(urlPattern) || [];

  // Common API patterns
  const apiPatterns = [
    {
      pattern: /\/api\/v?\d+/i,
      category: 'REST API',
      description: 'Standard REST API endpoint',
      securityProtocols: 'HTTPS, OAuth/JWT'
    },
    {
      pattern: /\/graphql/i,
      category: 'GraphQL API',
      description: 'GraphQL API endpoint',
      securityProtocols: 'HTTPS, API Key'
    },
    {
      pattern: /\/swagger|\/openapi/i,
      category: 'API Documentation',
      description: 'API documentation endpoint',
      securityProtocols: 'HTTPS'
    },
    {
      pattern: /\/health|\/status/i,
      category: 'Health Check',
      description: 'Health check endpoint',
      securityProtocols: 'HTTPS'
    },
    {
      pattern: /\/auth|\/login|\/token/i,
      category: 'Authentication',
      description: 'Authentication endpoint',
      securityProtocols: 'HTTPS, OAuth 2.0'
    }
  ];

  // Extract unique endpoints
  const uniqueEndpoints = [...new Set(paths)];
  
  uniqueEndpoints.forEach(endpoint => {
    // Find matching pattern
    const matchedPattern = apiPatterns.find(p => p.pattern.test(endpoint));
    
    if (matchedPattern) {
      discoveredApis.push({
        endpoint,
        category: matchedPattern.category,
        description: matchedPattern.description,
        securityProtocols: matchedPattern.securityProtocols
      });
    } else {
      // Default classification
      discoveredApis.push({
        endpoint,
        category: 'Unknown API',
        description: 'Discovered API endpoint',
        securityProtocols: 'HTTPS'
      });
    }
  });

  return { discoveredApis };
}

/**
 * Rule-based threat detection using heuristics
 */
export async function detectApiAnomaly(input: DetectApiAnomalyInput): Promise<DetectApiAnomalyOutput> {
  const { apiEndpoint, requestData, responseData, responseTime, trafficVolume, userRoles } = input;
  
  let anomalyScore = 0;
  const reasons: string[] = [];
  const actions: string[] = [];

  // Check for unusual response times
  if (responseTime > 5000) { // 5 seconds
    anomalyScore += 0.3;
    reasons.push('Unusually high response time');
    actions.push('Investigate server performance and database queries');
  } else if (responseTime < 50) { // Very fast response
    anomalyScore += 0.1;
    reasons.push('Suspiciously fast response time');
    actions.push('Verify response authenticity and check for caching');
  }

  // Check for unusual traffic volume
  if (trafficVolume > 1000) { // High traffic
    anomalyScore += 0.4;
    reasons.push('Unusually high traffic volume');
    actions.push('Check for DDoS attacks or legitimate traffic spikes');
  } else if (trafficVolume === 0) { // No traffic
    anomalyScore += 0.2;
    reasons.push('No traffic detected');
    actions.push('Verify API endpoint is active and accessible');
  }

  // Check for suspicious user roles
  if (userRoles.includes('anonymous') || userRoles.includes('public')) {
    anomalyScore += 0.2;
    reasons.push('Suspicious user role accessing sensitive endpoint');
    actions.push('Review access controls and authentication requirements');
  }

  // Check for error responses
  try {
    const response = JSON.parse(responseData);
    if (response.error || response.status === 'error' || response.code >= 400) {
      anomalyScore += 0.3;
      reasons.push('Error response detected');
      actions.push('Investigate error cause and check logs');
    }
  } catch {
    // Invalid JSON response
    anomalyScore += 0.2;
    reasons.push('Invalid JSON response format');
    actions.push('Check API response format and error handling');
  }

  // Check for suspicious request patterns
  if (requestData.includes('admin') || requestData.includes('root')) {
    anomalyScore += 0.4;
    reasons.push('Suspicious request data containing admin/root references');
    actions.push('Review request data and implement input validation');
  }

  // Determine threat level
  let threatLevel: 'low' | 'medium' | 'high' = 'low';
  if (anomalyScore >= 0.7) {
    threatLevel = 'high';
  } else if (anomalyScore >= 0.4) {
    threatLevel = 'medium';
  }

  // Cap anomaly score at 1.0
  anomalyScore = Math.min(anomalyScore, 1.0);

  const isAnomalous = anomalyScore > 0.3;
  const explanation = reasons.length > 0 
    ? `Anomaly detected based on: ${reasons.join(', ')}`
    : 'No significant anomalies detected';
  
  const suggestedActions = actions.length > 0 
    ? `Recommended actions: ${actions.join('; ')}`
    : 'Continue monitoring for any changes';

  return {
    isAnomalous,
    anomalyScore,
    threatLevel,
    explanation,
    suggestedActions
  };
} 