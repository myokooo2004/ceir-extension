import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchAndSolveAltcha, FetchError, type AltchaSolution } from '@/utils/altcha';
import { verifyImeis } from '@/utils/ceir-api';
import type { ImeiCheckResult } from '@/utils/types';

const DRAFT_KEY = 'ceir_imei_draft';

export type AppErrorKind = 'captcha' | 'captcha-403' | 'check';

export interface AppError {
  message: string;
  kind: AppErrorKind;
}

function parseImeis(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

/**
 * Encapsulates all captcha + IMEI-check business logic.
 */
export function useCeirChecker() {
  const [imeiText, setImeiText] = useState('');
  const [isCaptchaSolving, setIsCaptchaSolving] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<ImeiCheckResult[]>([]);
  const [appError, setAppError] = useState<AppError | null>(null);

  const solutionRef = useRef<AltchaSolution | null>(null);

  // ─── Captcha ──────────────────────────────────────────────────────────────

  const solveCaptcha = useCallback(async (): Promise<AltchaSolution | null> => {
    setIsCaptchaSolving(true);
    setAppError(null);
    solutionRef.current = null;
    try {
      const solution = await fetchAndSolveAltcha();
      solutionRef.current = solution;
      setIsCaptchaSolving(false);
      return solution;
    } catch (err: unknown) {
      const is403 = err instanceof FetchError && err.status === 403;
      const msg = is403
        ? 'Cloudflare blocked the request.'
        : err instanceof Error
          ? err.message
          : String(err);
      setAppError({ message: msg, kind: is403 ? 'captcha-403' : 'captcha' });
      setIsCaptchaSolving(false);
      return null;
    }
  }, []);

  // ─── Init (runs once) ─────────────────────────────────────────────────────

  const isInit = useRef(false);

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;

    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      setImeiText(draft);
      localStorage.removeItem(DRAFT_KEY);
    }

    solveCaptcha();
  }, [solveCaptcha]);

  // ─── Check ────────────────────────────────────────────────────────────────

  const handleCheck = useCallback(async () => {
    const imeis = parseImeis(imeiText);
    if (imeis.length === 0) return;

    let solution = solutionRef.current;
    if (!solution) return;

    setIsChecking(true);
    setAppError(null);
    setResults([]);

    try {
      const data = await verifyImeis(imeis, solution);
      setResults(data.IMEI_CHECK_LIST);
    } catch (err: unknown) {
      if (err instanceof FetchError && err.status === 412) {
        try {
          solution = await solveCaptcha();
          if (!solution) throw new Error('Failed to re-solve captcha.');
          const data = await verifyImeis(imeis, solution);
          setResults(data.IMEI_CHECK_LIST);
        } catch (retryErr: unknown) {
          const msg = retryErr instanceof Error ? retryErr.message : String(retryErr);
          setAppError({ message: msg, kind: 'check' });
        }
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setAppError({ message: msg, kind: 'check' });
      }
    } finally {
      setIsChecking(false);
    }
  }, [imeiText, solveCaptcha]);

  // ─── Retry ────────────────────────────────────────────────────────────────

  const handleRetry = useCallback(() => {
    if (!appError) return;
    switch (appError.kind) {
      case 'captcha-403':
        localStorage.setItem(DRAFT_KEY, imeiText);
        window.location.reload();
        break;
      case 'captcha':
        solveCaptcha();
        break;
      case 'check':
        handleCheck();
        break;
    }
  }, [appError, imeiText, solveCaptcha, handleCheck]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const canCheck =
    !isCaptchaSolving &&
    !appError &&
    !isChecking &&
    parseImeis(imeiText).length > 0;

  return {
    imeiText,
    setImeiText,
    isCaptchaSolving,
    isChecking,
    results,
    appError,
    canCheck,
    handleCheck,
    handleRetry,
  };
}
