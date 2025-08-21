"use server";

import { discoverApis, type DiscoverApisInput, type DiscoverApisOutput } from "@/ai/flows/smart-api-discovery";
import { z } from "zod";

const DiscoverApisActionInputSchema = z.object({
  trafficData: z.string().min(10, "Traffic data must be at least 10 characters long."),
});

export type DiscoverApisActionState = {
  message?: string;
  discoveredApis?: DiscoverApisOutput["discoveredApis"];
  error?: string;
  inputErrors?: z.ZodIssue[];
};

export async function discoverApisAction(
  prevState: DiscoverApisActionState,
  formData: FormData
): Promise<DiscoverApisActionState> {
  const rawFormData = {
    trafficData: formData.get("trafficData") as string,
  };

  const validatedFields = DiscoverApisActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      inputErrors: validatedFields.error.issues,
      error: "Invalid input provided."
    };
  }

  const input: DiscoverApisInput = {
    trafficData: validatedFields.data.trafficData,
  };

  try {
    const result = await discoverApis(input);
    if (result && result.discoveredApis) {
      return {
        message: "API discovery process completed.",
        discoveredApis: result.discoveredApis,
      };
    } else {
      return {
        message: "API discovery process completed, but no APIs were found or the result format was unexpected.",
        error: "No APIs discovered or unexpected result format.",
      };
    }
  } catch (e: any) {
    console.error("Error in discoverApisAction:", e);
    return {
      message: "An error occurred during API discovery.",
      error: e.message || "Unknown error",
    };
  }
}
