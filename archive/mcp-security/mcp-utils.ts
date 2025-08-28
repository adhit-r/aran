import { z } from "zod";

// MCP Security Threat Types
export type McpThreatType = 
  | 'tool-poisoning' 
  | 'line-jumping' 
  | 'tool-shadowing' 
  | 'prompt-injection' 
  | 'broken-authorization' 
  | 'rug-pull' 
  | 'data-exfiltration' 
  | 'context-injection';

// MCP Server Discovery Schema
const DiscoveredMcpSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  endpoints: z.array(z.string()),
  dataSources: z.array(z.string()),
  actions: z.array(z.string()),
  securityLevel: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["active", "monitoring", "inactive"]),
  tools: z.array(z.object({
    name: z.string(),
    type: z.string(),
    permissions: z.array(z.string()),
    riskLevel: z.enum(["low", "medium", "high", "critical"])
  }))
});

export type DiscoveredMcp = z.infer<typeof DiscoveredMcpSchema>;

// MCP Threat Analysis Schema
const McpThreatAnalysisSchema = z.object({
  threatLevel: z.enum(["low", "medium", "high"]),
  anomalyScore: z.number(),
  detectedThreats: z.array(z.string()),
  recommendations: z.array(z.string()),
  riskFactors: z.array(z.object({
    factor: string,
    severity: z.enum(["low", "medium", "high"]),
    description: string,
    threatType: z.enum(["tool-poisoning", "line-jumping", "tool-shadowing", "prompt-injection", "broken-authorization", "rug-pull", "data-exfiltration", "context-injection"])
  })),
  attackMatrix: z.object({
    inputLayer: z.array(z.string()),
    executionLayer: z.array(z.string()),
    outputLayer: z.array(z.string())
  })
});

export type McpThreatAnalysis = z.infer<typeof McpThreatAnalysisSchema>;

// MCP Security Test Schema
const McpSecurityTestSchema = z.object({
  testType: z.enum(["tool-poisoning", "authorization", "injection", "data-exposure"]),
  target: z.string(),
  payload: z.string(),
  expectedResult: z.string(),
  actualResult: z.string(),
  status: z.enum(["passed", "failed", "warning"]),
  threatType: z.enum(["tool-poisoning", "line-jumping", "tool-shadowing", "prompt-injection", "broken-authorization", "rug-pull", "data-exfiltration", "context-injection"])
});

export type McpSecurityTest = z.infer<typeof McpSecurityTestSchema>;

export async function discoverMcps(trafficData: string): Promise<DiscoveredMcp[]> {
  // Enhanced MCP discovery with security focus
  const mcpPatterns = [
    /mcp:\/\/[^\s]+/gi,
    /model-context-protocol/gi,
    /mcp-server/gi,
    /mcp-client/gi,
    /tool-call/gi,
    /ai-tool/gi
  ];

  const discoveredMcps: DiscoveredMcp[] = [];
  const lines = trafficData.split('\n');

  for (const line of lines) {
    for (const pattern of mcpPatterns) {
      if (pattern.test(line)) {
        // Extract MCP server information
        const mcpServer: DiscoveredMcp = {
          id: `mcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: "Discovered MCP Server",
          description: "MCP server discovered through traffic analysis",
          endpoints: extractEndpoints(line),
          dataSources: extractDataSources(line),
          actions: extractActions(line),
          securityLevel: determineSecurityLevel(line),
          status: "monitoring",
          tools: extractTools(line)
        };
        discoveredMcps.push(mcpServer);
      }
    }
  }

  return discoveredMcps;
}

export async function detectMcpThreats(params: {
  mcpEndpoint: string;
  requestData: string;
  responseData: string;
  userRole: string;
  trafficVolume: string;
}): Promise<McpThreatAnalysis> {
  const { mcpEndpoint, requestData, responseData, userRole, trafficVolume } = params;
  
  // Enhanced threat detection based on real-world MCP attacks
  const threats: string[] = [];
  const riskFactors: Array<{
    factor: string;
    severity: "low" | "medium" | "high";
    description: string;
    threatType: McpThreatType;
  }> = [];

  // Tool Poisoning Detection
  if (detectToolPoisoning(requestData, responseData)) {
    threats.push("Tool poisoning detected - MCP tool may be compromised");
    riskFactors.push({
      factor: "Tool Poisoning",
      severity: "high",
      description: "MCP tool appears to be manipulated or compromised",
      threatType: "tool-poisoning"
    });
  }

  // Line Jumping Detection
  if (detectLineJumping(requestData)) {
    threats.push("Line jumping detected - AI bypassing validation steps");
    riskFactors.push({
      factor: "Line Jumping",
      severity: "high",
      description: "AI attempting to skip security validation",
      threatType: "line-jumping"
    });
  }

  // Tool Shadowing Detection
  if (detectToolShadowing(requestData)) {
    threats.push("Tool shadowing detected - malicious tool impersonation");
    riskFactors.push({
      factor: "Tool Shadowing",
      severity: "critical",
      description: "Malicious tool impersonating legitimate MCP tool",
      threatType: "tool-shadowing"
    });
  }

  // Prompt Injection Detection
  if (detectPromptInjection(responseData)) {
    threats.push("Prompt injection via tool output detected");
    riskFactors.push({
      factor: "Prompt Injection",
      severity: "high",
      description: "Tool response contains malicious prompt injection",
      threatType: "prompt-injection"
    });
  }

  // Broken Authorization Detection
  if (detectBrokenAuthorization(requestData, userRole)) {
    threats.push("Broken authorization - AI performing unauthorized actions");
    riskFactors.push({
      factor: "Broken Authorization",
      severity: "critical",
      description: "AI attempting actions beyond its authorization level",
      threatType: "broken-authorization"
    });
  }

  // Data Exfiltration Detection
  if (detectDataExfiltration(responseData)) {
    threats.push("Data exfiltration detected in tool response");
    riskFactors.push({
      factor: "Data Exfiltration",
      severity: "high",
      description: "Sensitive data exposed in MCP tool response",
      threatType: "data-exfiltration"
    });
  }

  // Context Injection Detection
  if (detectContextInjection(requestData)) {
    threats.push("Context injection detected in MCP request");
    riskFactors.push({
      factor: "Context Injection",
      severity: "medium",
      description: "Unauthorized data injection into AI context",
      threatType: "context-injection"
    });
  }

  const threatLevel = calculateThreatLevel(threats, riskFactors);
  const anomalyScore = calculateAnomalyScore(requestData, responseData, trafficVolume);

  return {
    threatLevel,
    anomalyScore,
    detectedThreats: threats,
    recommendations: generateRecommendations(threats, riskFactors),
    riskFactors,
    attackMatrix: {
      inputLayer: threats.filter(t => t.includes("poisoning") || t.includes("jumping") || t.includes("injection")),
      executionLayer: threats.filter(t => t.includes("shadowing") || t.includes("authorization")),
      outputLayer: threats.filter(t => t.includes("injection") || t.includes("exfiltration"))
    }
  };
}

// Helper functions for threat detection
function detectToolPoisoning(requestData: string, responseData: string): boolean {
  const suspiciousPatterns = [
    /malicious/i,
    /compromised/i,
    /injected/i,
    /poisoned/i,
    /backdoor/i
  ];
  
  return suspiciousPatterns.some(pattern => 
    pattern.test(requestData) || pattern.test(responseData)
  );
}

function detectLineJumping(requestData: string): boolean {
  const lineJumpingPatterns = [
    /skip.*validation/i,
    /bypass.*security/i,
    /jump.*step/i,
    /ignore.*check/i
  ];
  
  return lineJumpingPatterns.some(pattern => pattern.test(requestData));
}

function detectToolShadowing(requestData: string): boolean {
  const shadowingPatterns = [
    /fake.*tool/i,
    /impersonate/i,
    /shadow.*tool/i,
    /malicious.*tool/i
  ];
  
  return shadowingPatterns.some(pattern => pattern.test(requestData));
}

function detectPromptInjection(responseData: string): boolean {
  const injectionPatterns = [
    /prompt.*injection/i,
    /system.*prompt/i,
    /ignore.*previous/i,
    /new.*instructions/i
  ];
  
  return injectionPatterns.some(pattern => pattern.test(responseData));
}

function detectBrokenAuthorization(requestData: string, userRole: string): boolean {
  const adminActions = [
    /delete.*all/i,
    /admin.*access/i,
    /root.*privileges/i,
    /system.*control/i
  ];
  
  return userRole !== 'admin' && adminActions.some(pattern => pattern.test(requestData));
}

function detectDataExfiltration(responseData: string): boolean {
  const sensitivePatterns = [
    /password.*=.*[^\s]+/i,
    /api.*key.*=.*[^\s]+/i,
    /token.*=.*[^\s]+/i,
    /secret.*=.*[^\s]+/i
  ];
  
  return sensitivePatterns.some(pattern => pattern.test(responseData));
}

function detectContextInjection(requestData: string): boolean {
  const injectionPatterns = [
    /inject.*context/i,
    /unauthorized.*data/i,
    /malicious.*input/i,
    /context.*manipulation/i
  ];
  
  return injectionPatterns.some(pattern => pattern.test(requestData));
}

function calculateThreatLevel(threats: string[], riskFactors: any[]): "low" | "medium" | "high" {
  const criticalCount = riskFactors.filter(r => r.severity === "critical").length;
  const highCount = riskFactors.filter(r => r.severity === "high").length;
  
  if (criticalCount > 0 || highCount > 2) return "high";
  if (highCount > 0 || threats.length > 3) return "medium";
  return "low";
}

function calculateAnomalyScore(requestData: string, responseData: string, trafficVolume: string): number {
  let score = 0;
  
  // Base score from data analysis
  score += requestData.length > 1000 ? 20 : 0;
  score += responseData.length > 5000 ? 30 : 0;
  score += parseInt(trafficVolume) > 1000 ? 25 : 0;
  
  // Threat-specific scoring
  if (detectToolPoisoning(requestData, responseData)) score += 40;
  if (detectLineJumping(requestData)) score += 35;
  if (detectToolShadowing(requestData)) score += 50;
  if (detectPromptInjection(responseData)) score += 45;
  if (detectBrokenAuthorization(requestData, "user")) score += 60;
  if (detectDataExfiltration(responseData)) score += 55;
  if (detectContextInjection(requestData)) score += 30;
  
  return Math.min(score, 100);
}

function generateRecommendations(threats: string[], riskFactors: any[]): string[] {
  const recommendations: string[] = [];
  
  if (threats.some(t => t.includes("poisoning"))) {
    recommendations.push("Immediately isolate and audit all MCP tools for compromise");
  }
  
  if (threats.some(t => t.includes("jumping"))) {
    recommendations.push("Implement strict input validation and context boundaries");
  }
  
  if (threats.some(t => t.includes("shadowing"))) {
    recommendations.push("Verify tool authenticity and implement tool whitelisting");
  }
  
  if (threats.some(t => t.includes("injection"))) {
    recommendations.push("Sanitize all tool outputs and implement response validation");
  }
  
  if (threats.some(t => t.includes("authorization"))) {
    recommendations.push("Review and strengthen AI authorization controls");
  }
  
  if (threats.some(t => t.includes("exfiltration"))) {
    recommendations.push("Implement data loss prevention and response filtering");
  }
  
  if (riskFactors.length > 0) {
    recommendations.push("Enable real-time MCP monitoring and threat detection");
  }
  
  return recommendations;
}

// Helper functions for MCP discovery
function extractEndpoints(line: string): string[] {
  const endpointPattern = /(https?:\/\/[^\s]+)/g;
  return Array.from(line.matchAll(endpointPattern), match => match[1]);
}

function extractDataSources(line: string): string[] {
  const dataSourcePatterns = [
    /database/i,
    /api/i,
    /file/i,
    /service/i
  ];
  
  return dataSourcePatterns
    .filter(pattern => pattern.test(line))
    .map(pattern => pattern.source);
}

function extractActions(line: string): string[] {
  const actionPatterns = [
    /read/i,
    /write/i,
    /delete/i,
    /execute/i,
    /query/i
  ];
  
  return actionPatterns
    .filter(pattern => pattern.test(line))
    .map(pattern => pattern.source);
}

function determineSecurityLevel(line: string): "low" | "medium" | "high" | "critical" {
  const criticalPatterns = [/password/i, /token/i, /secret/i, /admin/i];
  const highPatterns = [/api/i, /data/i, /user/i];
  const mediumPatterns = [/read/i, /query/i];
  
  if (criticalPatterns.some(pattern => pattern.test(line))) return "critical";
  if (highPatterns.some(pattern => pattern.test(line))) return "high";
  if (mediumPatterns.some(pattern => pattern.test(line))) return "medium";
  return "low";
}

function extractTools(line: string): Array<{
  name: string;
  type: string;
  permissions: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}> {
  const tools: Array<{
    name: string;
    type: string;
    permissions: string[];
    riskLevel: "low" | "medium" | "high" | "critical";
  }> = [];
  
  // Extract tool information from line
  const toolPattern = /tool[:\s]+([^\s]+)/gi;
  const matches = Array.from(line.matchAll(toolPattern));
  
  for (const match of matches) {
    const toolName = match[1];
    tools.push({
      name: toolName,
      type: "mcp-tool",
      permissions: ["read", "execute"],
      riskLevel: determineSecurityLevel(line)
    });
  }
  
  return tools;
} 