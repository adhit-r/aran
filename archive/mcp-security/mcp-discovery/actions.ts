"use server";

import { z } from "zod";
import { discoverMcps } from "@/lib/mcp-utils";

const discoverMcpsSchema = z.object({
  trafficData: z.string().min(1, "Traffic data is required"),
});

export type DiscoverMcpsActionState = {
  message: string;
  error?: string;
  inputErrors?: Array<{ path: string[]; message: string }>;
  discoveredMcps?: Array<{
    id: string;
    name: string;
    description: string;
    endpoints: string[];
    dataSources: string[];
    actions: string[];
    securityLevel: "low" | "medium" | "high" | "critical";
    status: "active" | "monitoring" | "inactive";
  }>;
};

export async function discoverMcpsAction(
  prevState: DiscoverMcpsActionState,
  formData: FormData
): Promise<DiscoverMcpsActionState> {
  try {
    const validatedFields = discoverMcpsSchema.safeParse({
      trafficData: formData.get("trafficData"),
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

    const { trafficData } = validatedFields.data;
    const discoveredMcps = await discoverMcps(trafficData);

    return {
      message: `Successfully discovered ${discoveredMcps.length} MCP implementations from the provided traffic data.`,
      discoveredMcps,
    };
  } catch (error) {
    return {
      message: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
} 