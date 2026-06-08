/**
 * Altcha Proof-of-Work (PoW) utilities.
 *
 * Implements the same algorithm as the official `altcha-lib`:
 *   hash = SHA-256(salt + number.toString())
 *   Find the `number` in [0, maxnumber] such that hex(hash) === challenge.
 *
 * Uses the Web Crypto API (`crypto.subtle`) — available natively in Chrome
 * extension content scripts and service workers without any polyfills.
 */

import { pageFetch } from './page-fetch';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AltchaChallengeResponse {
  algorithm: string;
  challenge: string;
  maxnumber: number;
  salt: string;
  signature: string;
}

export class FetchError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

export interface AltchaSolution {
  algorithm: string;
  challenge: string;
  number: number;
  salt: string;
  signature: string;
  /** Wall-clock time taken to solve, in milliseconds. */
  took: number;
}

// ─── Internals ────────────────────────────────────────────────────────────────

/**
 * Compute the SHA-256 hex digest of a UTF-8 string using the Web Crypto API.
 */
async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch the Altcha challenge from the CEIR API.
 */
export async function fetchAltchaChallenge(): Promise<AltchaChallengeResponse> {
  const response = await pageFetch('https://ceir.gov.mm/openapi/API/Auth/altcha/altcha', {
    method: 'GET',
    referrer: 'https://ceir.gov.mm/check-status',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new FetchError(response.status, `Failed to fetch Altcha challenge: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<AltchaChallengeResponse>;
}

// ─── Worker-based parallel solver ─────────────────────────────────────────────

/**
 * Self-contained worker script as a string.
 * Each worker searches a sub-range [start, end] with batched hashing.
 */
const WORKER_SOURCE = /* js */ `
  const BATCH = 500;

  async function sha256Hex(input) {
    const encoded = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest("SHA-256", encoded);
    const arr = new Uint8Array(buf);
    let hex = "";
    for (let i = 0; i < arr.length; i++) {
      hex += arr[i].toString(16).padStart(2, "0");
    }
    return hex;
  }

  self.onmessage = async function (e) {
    const { salt, challenge, start, end } = e.data;

    for (let batchStart = start; batchStart <= end; batchStart += BATCH) {
      const batchEnd = Math.min(batchStart + BATCH - 1, end);
      const promises = [];

      for (let n = batchStart; n <= batchEnd; n++) {
        promises.push(
          sha256Hex(salt + n).then(function (hash) {
            return hash === challenge ? n : -1;
          })
        );
      }

      const results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        if (results[i] !== -1) {
          self.postMessage({ found: true, number: results[i] });
          return;
        }
      }
    }

    self.postMessage({ found: false });
  };
`;

/**
 * Solve an Altcha PoW challenge using parallel Web Workers.
 *
 * Spawns one worker per logical CPU core. Each worker searches a
 * non-overlapping sub-range of [0, maxnumber] with batched hashing
 * (500 concurrent SHA-256 digests per tick).
 *
 * @throws {Error} if no solution is found within `[0, maxnumber]`.
 */
export async function solveAltchaChallenge(
  challengeData: AltchaChallengeResponse,
): Promise<AltchaSolution> {
  const { algorithm, challenge, maxnumber, salt, signature } = challengeData;

  if (algorithm !== 'SHA-256') {
    throw new Error(`Unsupported Altcha algorithm: ${algorithm}`);
  }

  const numWorkers = Math.min(navigator.hardwareConcurrency || 4, 16);
  const rangeSize = Math.ceil((maxnumber + 1) / numWorkers);
  const startTime = performance.now();

  const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
  const blobUrl = URL.createObjectURL(blob);

  return new Promise<AltchaSolution>((resolve, reject) => {
    const workers: Worker[] = [];
    let settled = false;
    let finishedCount = 0;

    const cleanup = () => {
      for (const w of workers) w.terminate();
      URL.revokeObjectURL(blobUrl);
    };

    for (let i = 0; i < numWorkers; i++) {
      const start = i * rangeSize;
      const end = Math.min(start + rangeSize - 1, maxnumber);

      const worker = new Worker(blobUrl);
      workers.push(worker);

      worker.onmessage = (e: MessageEvent<{ found: boolean; number?: number }>) => {
        if (settled) return;

        if (e.data.found && e.data.number !== undefined) {
          settled = true;
          const took = Math.round(performance.now() - startTime);
          cleanup();
          resolve({ algorithm, challenge, number: e.data.number, salt, signature, took });
        } else {
          finishedCount++;
          if (finishedCount === numWorkers) {
            settled = true;
            cleanup();
            reject(new Error(`No Altcha solution found within maxnumber=${maxnumber}`));
          }
        }
      };

      worker.onerror = (err) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(`Worker error: ${err.message}`));
      };

      worker.postMessage({ salt, challenge, start, end });
    }
  });
}

/**
 * Convenience function: fetch the challenge and solve it in one call.
 *
 * @returns The solved Altcha payload, ready to be submitted to the server.
 */
export async function fetchAndSolveAltcha(): Promise<AltchaSolution> {
  const challengeData = await fetchAltchaChallenge();
  console.log('[Altcha] Challenge received:', challengeData);
  const solution = await solveAltchaChallenge(challengeData);
  console.log('[Altcha] Solution found:', solution);
  return solution;
}
