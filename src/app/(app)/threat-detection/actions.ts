"use server";

import { detectApiAnomaly, type DetectApiAnomalyInput, type DetectApiAnomalyOutput } from "@/ai/flows/anomaly-detection";
import { z } from "zod";

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
  analysisResult?: DetectApiAnomalyOutput;
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

  const input: DetectApiAnomalyInput = {
    apiEndpoint: validatedFields.data.apiEndpoint,
    requestData: validatedFields.data.requestData,
    responseData: validatedFields.data.responseData,
    responseTime: validatedFields.data.responseTime,
    trafficVolume: validatedFields.data.trafficVolume,
    userRoles: validatedFields.data.userRoles,
  };

  try {
    const result = await detectApiAnomaly(input);
    if (result) {
      return {
        message: "API traffic analysis completed.",
        analysisResult: result,
      };
    } else {
      return {
        message: "API traffic analysis completed, but no specific anomaly details were returned.",
        error: "Analysis result format was unexpected.",
      };
    }
  } catch (e: any) {
    console.error("Error in detectApiAnomalyAction:", e);
    return {
      message: "An error occurred during threat detection.",
      error: e.message || "Unknown error",
    };
  }
}
