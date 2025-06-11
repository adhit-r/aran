'use server';

/**
 * @fileOverview AI-powered API discovery flow.
 *
 * - discoverApis - A function that triggers the API discovery process.
 * - DiscoverApisInput - The input type for the discoverApis function.
 * - DiscoverApisOutput - The return type for the discoverApis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverApisInputSchema = z.object({
  trafficData: z
    .string()
    .describe(
      'API traffic data, including endpoint URLs, request/response structures, and security protocols.'
    ),
});
export type DiscoverApisInput = z.infer<typeof DiscoverApisInputSchema>;

const DiscoverApisOutputSchema = z.object({
  discoveredApis: z
    .array(
      z.object({
        endpoint: z.string().describe('The API endpoint URL.'),
        category: z.string().describe('The category of the API.'),
        description: z.string().describe('A brief description of the API.'),
        securityProtocols: z.string().describe('The security protocols used by the API.'),
      })
    )
    .describe('A list of discovered APIs with their metadata.'),
});
export type DiscoverApisOutput = z.infer<typeof DiscoverApisOutputSchema>;

export async function discoverApis(input: DiscoverApisInput): Promise<DiscoverApisOutput> {
  return discoverApisFlow(input);
}

const discoverApisPrompt = ai.definePrompt({
  name: 'discoverApisPrompt',
  input: {schema: DiscoverApisInputSchema},
  output: {schema: DiscoverApisOutputSchema},
  prompt: `You are an expert API discovery tool. Analyze the provided API traffic data to identify and categorize APIs.

Traffic Data:
{{{trafficData}}}

Based on the traffic data, identify the API endpoints, their categories, descriptions, and security protocols.
Return a list of discovered APIs with their metadata in JSON format.
`,
});

const discoverApisFlow = ai.defineFlow(
  {
    name: 'discoverApisFlow',
    inputSchema: DiscoverApisInputSchema,
    outputSchema: DiscoverApisOutputSchema,
  },
  async input => {
    const {output} = await discoverApisPrompt(input);
    return output!;
  }
);
