"use server";

import { z } from "zod";
import { aiRouter, type AIAnalysisResult } from "@/lib/ai-router";

const detectMcpThreatsSchema = z.object({
  mcpEndpoint: z.string().min(1, "MCP endpoint is required"),
  requestData: z.string().optional(),
  responseData: z.string().optional(),
  userRole: z.string().optional(),
  trafficVolume: z.string().optional(),
});

export type DetectMcpThreatsActionState = {
  message: string;
  error?: string;
  inputErrors?: Array<{ path: string[]; message: string }>;
  analysisResult?: AIAnalysisResult;
};

export async function detectMcpThreatsAction(
  prevState: DetectMcpThreatsActionState,
  formData: FormData
): Promise<DetectMcpThreatsActionState> {
  try {
    const validatedFields = detectMcpThreatsSchema.safeParse({
      mcpEndpoint: formData.get("mcpEndpoint"),
      requestData: formData.get("requestData"),
      responseData: formData.get("responseData"),
      userRole: formData.get("userRole"),
      trafficVolume: formData.get("trafficVolume"),
    });

    if (!validatedFields.success) {
      return {
        message: "",
        inputErrors: validatedFields.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
        })),
      };
    }

    const { mcpEndpoint, requestData, responseData, userRole, trafficVolume } = validatedFields.data;
    
    // Use AI router for hybrid MCP analysis
    const result = await aiRouter.analyzeThreat({
      type: 'mcp-threat',
      data: {
        mcpEndpoint,
        requestData: requestData || "",
        responseData: responseData || "",
        userRole: userRole || "",
        trafficVolume: trafficVolume || "",
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
  } catch (error) {
    return {
      message: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
} 