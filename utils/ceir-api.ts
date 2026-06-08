import type { AltchaSolution } from './altcha';
import type { ImeiCheckResponse } from './types';
import { FetchError } from './altcha';
import { pageFetch } from './page-fetch';

/**
 * Encode an AltchaSolution as a Base64 string for the query parameter.
 */
export function encodeAltchaSolution(solution: AltchaSolution): string {
  return btoa(JSON.stringify(solution));
}

/**
 * Call the CEIR IMEI Verify API.
 *
 * @param imeis  Array of IMEI strings to check.
 * @param solution  The solved Altcha payload.
 * @returns Parsed API response containing the check results.
 * @throws {FetchError} with `status` set to the HTTP code on non-OK responses.
 */
export async function verifyImeis(
  imeis: string[],
  solution: AltchaSolution,
): Promise<ImeiCheckResponse> {
  const altchaParam = encodeAltchaSolution(solution);

  const response = await pageFetch(
    `https://ceir.gov.mm/openapi/API/IMEI/Verify?altcha=${altchaParam}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      referrer: 'https://ceir.gov.mm/check-status',
      credentials: 'include',
      body: JSON.stringify(imeis),
    },
  );

  if (!response.ok) {
    throw new FetchError(
      response.status,
      `IMEI verify failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<ImeiCheckResponse>;
}
