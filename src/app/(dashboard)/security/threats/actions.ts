"use server";

import { z } from "zod";
import { aiRouter, type AIAnalysisResult } from "@/lib/ai-router";

const DetectApiAnomalyActionInputSchema = z.object({
  apiEndpoint: z.string().min(1, "API Endpoint is required."),
  requestData: z.string().min(1, "Request Data is required. Enter '{}' if empty."),
  responseData: z.string().min(1, "Response Data is required. Enter '{}' if empty."),
  responseTime: z.coerce.number().min(0, "Response Time must be a positive number."),
  trafficVolume: z.coerce.number().min(0, "Traffic Volume must be a positive number."),
  userRoles: z.string().transform((val) => val.split(',').map(role => role.trim()).filter(role => role.length > 0)),
});

export type DetectApiAnomalyActionState = {
  message?: string;
  analysisResult?: AIAnalysisResult;
  error?: string;
  inputErrors?: z.ZodIssue[];
};

export async function detectApiAnomalyAction(
  prevState: DetectApiAnomalyActionState,
  formData: FormData
): Promise<DetectApiAnomalyActionState> {
  const rawFormData = {
    apiEndpoint: formData.get("apiEndpoint"),
    requestData: formData.get("requestData"),
    responseData: formData.get("responseData"),
    responseTime: formData.get("responseTime"),
    trafficVolume: formData.get("trafficVolume"),
    userRoles: formData.get("userRoles"),
  };

  const validatedFields = DetectApiAnomalyActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      inputErrors: validatedFields.error.issues,
      error: "Invalid input provided."
    };
  }

  const input = validatedFields.data;

  try {
    // Use AI router for hybrid analysis
    const result = await aiRouter.analyzeThreat({
      type: 'api-anomaly',
      data: {
        apiEndpoint: input.apiEndpoint,
        requestData: input.requestData,
        responseData: input.responseData,
        responseTime: input.responseTime,
        trafficVolume: input.trafficVolume,
        userRoles: input.userRoles,
      },
      context: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });

    return {
      message: `AI analysis completed using ${result.provider}. Confidence: ${(result.confidence * 100).toFixed(1)}%`,
      analysisResult: result,
    };
  } catch (e: any) {
    console.error("Error in detectApiAnomalyAction:", e);
    return {
      message: "An error occurred during threat detection.",
      error: e.message || "Unknown error",
    };
  }
}

// MCP Threat Detection Action
const DetectMcpThreatsActionInputSchema = z.object({
  mcpEndpoint: z.string().min(1, "MCP endpoint is required"),
  requestData: z.string().optional(),
  responseData: z.string().optional(),
  userRole: z.string().optional(),
  trafficVolume: z.string().optional(),
});

export type DetectMcpThreatsActionState = {
  message?: string;
  analysisResult?: AIAnalysisResult;
  error?: string;
  inputErrors?: z.ZodIssue[];
};

export async function detectMcpThreatsAction(
  prevState: DetectMcpThreatsActionState,
  formData: FormData
): Promise<DetectMcpThreatsActionState> {
  const rawFormData = {
    mcpEndpoint: formData.get("mcpEndpoint"),
    requestData: formData.get("requestData"),
    responseData: formData.get("responseData"),
    userRole: formData.get("userRole"),
    trafficVolume: formData.get("trafficVolume"),
  };

  const validatedFields = DetectMcpThreatsActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      inputErrors: validatedFields.error.issues,
      error: "Invalid input provided."
    };
  }

  const input = validatedFields.data;

  try {
    // Use AI router for hybrid MCP analysis
    const result = await aiRouter.analyzeThreat({
      type: 'mcp-threat',
      data: {
        mcpEndpoint: input.mcpEndpoint,
        requestData: input.requestData || "",
        responseData: input.responseData || "",
        userRole: input.userRole || "",
        trafficVolume: input.trafficVolume || "",
      },
      context: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });

    return {
      message: `MCP threat analysis completed using ${result.provider}. Confidence: ${(result.confidence * 100).toFixed(1)}%`,
      analysisResult: result,
    };
  } catch (e: any) {
    console.error("Error in detectMcpThreatsAction:", e);
    return {
      message: "An error occurred during MCP threat detection.",
      error: e.message || "Unknown error",
    };
  }
}

// Security Scan Action
const SecurityScanActionInputSchema = z.object({
  scanType: z.enum(['full', 'quick', 'targeted']),
  targetPath: z.string().optional(),
  includePatterns: z.string().optional(),
  excludePatterns: z.string().optional(),
});

export type SecurityScanActionState = {
  message?: string;
  analysisResult?: AIAnalysisResult;
  error?: string;
  inputErrors?: z.ZodIssue[];
};

export async function securityScanAction(
  prevState: SecurityScanActionState,
  formData: FormData
): Promise<SecurityScanActionState> {
  const rawFormData = {
    scanType: formData.get("scanType"),
    targetPath: formData.get("targetPath"),
    includePatterns: formData.get("includePatterns"),
    excludePatterns: formData.get("excludePatterns"),
  };

  const validatedFields = SecurityScanActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      inputErrors: validatedFields.error.issues,
      error: "Invalid input provided."
    };
  }

  const input = validatedFields.data;

  try {
    // Use AI router for security scan analysis
    const result = await aiRouter.analyzeThreat({
      type: 'security-scan',
      data: {
        scanType: input.scanType,
        targetPath: input.targetPath || './src',
        includePatterns: input.includePatterns || '**/*.{ts,tsx,js,jsx}',
        excludePatterns: input.excludePatterns || 'node_modules/**',
      },
      context: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });

    return {
      message: `Security scan completed using ${result.provider}. Confidence: ${(result.confidence * 100).toFixed(1)}%`,
      analysisResult: result,
    };
  } catch (e: any) {
    console.error("Error in securityScanAction:", e);
    return {
      message: "An error occurred during security scanning.",
      error: e.message || "Unknown error",
    };
  }
}
