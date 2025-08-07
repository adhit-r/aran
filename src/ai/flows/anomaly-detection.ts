
'use server';

/**
 * @fileOverview An anomaly detection system that identifies unusual API traffic patterns and potential security threats.
 *
 * - detectApiAnomaly - A function that handles the API anomaly detection process.
 * - DetectApiAnomalyInput - The input type for the detectApiAnomaly function.
 * - DetectApiAnomalyOutput - The return type for the detectApiAnomaly function.
 */

import { detectApiAnomaly as localDetectApiAnomaly, type DetectApiAnomalyInput, type DetectApiAnomalyOutput } from '@/lib/ai-utils';

export { type DetectApiAnomalyInput, type DetectApiAnomalyOutput };

export async function detectApiAnomaly(input: DetectApiAnomalyInput): Promise<DetectApiAnomalyOutput> {
  return localDetectApiAnomaly(input);
}
