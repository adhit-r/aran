"use server";

import { z } from "zod";
import { detectMcpThreats } from "@/lib/mcp-utils";

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
  threatAnalysis?: {
    threatLevel: "low" | "medium" | "high";
    anomalyScore: number;
    detectedThreats: string[];
    recommendations: string[];
    riskFactors: Array<{
      factor: string;
      severity: "low" | "medium" | "high";
      description: string;
    }>;
  };
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
    const threatAnalysis = await detectMcpThreats({
      mcpEndpoint,
      requestData: requestData || "",
      responseData: responseData || "",
      userRole: userRole || "",
      trafficVolume: trafficVolume || "",
    });

    return {
      message: `Threat analysis completed. Threat level: ${threatAnalysis.threatLevel.toUpperCase()}`,
      threatAnalysis,
    };
  } catch (error) {
    return {
      message: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
} 