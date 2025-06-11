'use server';

/**
 * @fileOverview An anomaly detection AI agent that identifies unusual API traffic patterns and potential security threats.
 *
 * - detectApiAnomaly - A function that handles the API anomaly detection process.
 * - DetectApiAnomalyInput - The input type for the detectApiAnomaly function.
 * - DetectApiAnomalyOutput - The return type for the detectApiAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectApiAnomalyInputSchema = z.object({
  apiEndpoint: z.string().describe('The API endpoint being monitored.'),
  requestData: z.string().describe('The API request data in JSON format.'),
  responseData: z.string().describe('The API response data in JSON format.'),
  responseTime: z.number().describe('The API response time in milliseconds.'),
  trafficVolume: z.number().describe('The number of requests to the API endpoint in the last minute.'),
  userRoles: z.array(z.string()).describe('Roles of the user making the API call.'),
});
export type DetectApiAnomalyInput = z.infer<typeof DetectApiAnomalyInputSchema>;

const DetectApiAnomalyOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the API traffic is anomalous.'),
  anomalyScore: z.number().describe('A score indicating the severity of the anomaly (0-1).'),
  threatLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The threat level of the anomaly.'),
  explanation: z
    .string()
    .describe('An explanation of why the API traffic is considered anomalous.'),
  suggestedActions: z
    .string()
    .describe('Suggested actions to take in response to the anomaly.'),
});
export type DetectApiAnomalyOutput = z.infer<typeof DetectApiAnomalyOutputSchema>;

export async function detectApiAnomaly(input: DetectApiAnomalyInput): Promise<DetectApiAnomalyOutput> {
  return detectApiAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectApiAnomalyPrompt',
  input: {schema: DetectApiAnomalyInputSchema},
  output: {schema: DetectApiAnomalyOutputSchema},
  prompt: `You are an expert API security analyst specializing in detecting unusual API traffic patterns and potential security threats.

You will use this information to determine if the API traffic is anomalous. You will calculate an anomaly score (0-1) based on the severity of the anomaly, set the isAnomalous output field appropriately, and determine the threat level (low, medium, high).

Based on the anomaly detected, provide suggested actions to take in response to the anomaly.

API Endpoint: {{{apiEndpoint}}}
Request Data: {{{requestData}}}
Response Data: {{{responseData}}}
Response Time: {{{responseTime}}} ms
Traffic Volume: {{{trafficVolume}}}
User Roles: {{#each userRoles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider the following factors when determining if the traffic is anomalous:
- Unusual request or response data
- Unexpected response time
- Abnormal traffic volume
- Suspicious user roles
`,
});

const detectApiAnomalyFlow = ai.defineFlow(
  {
    name: 'detectApiAnomalyFlow',
    inputSchema: DetectApiAnomalyInputSchema,
    outputSchema: DetectApiAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
