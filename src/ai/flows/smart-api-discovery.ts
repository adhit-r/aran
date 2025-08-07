
'use server';

/**
 * @fileOverview API discovery system.
 *
 * - discoverApis - A function that triggers the API discovery process.
 * - DiscoverApisInput - The input type for the discoverApis function.
 * - DiscoverApisOutput - The return type for the discoverApis function.
 */

import { discoverApis as localDiscoverApis, type DiscoverApisInput, type DiscoverApisOutput } from '@/lib/ai-utils';

export { type DiscoverApisInput, type DiscoverApisOutput };

export async function discoverApis(input: DiscoverApisInput): Promise<DiscoverApisOutput> {
  return localDiscoverApis(input);
}
