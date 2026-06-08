import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorCard from '@/components/ErrorCard';
import ResultsSection from '@/components/ResultsSection';
import GitHubBanner from '@/components/GitHubBanner';
import { useCeirChecker } from '@/hooks/useCeirChecker';

function CeirApp() {
  const {
    imeiText,
    setImeiText,
    isCaptchaSolving,
    isChecking,
    results,
    appError,
    canCheck,
    handleCheck,
    handleRetry,
  } = useCeirChecker();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            CEIR Extension
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            IMEI များကို တစ်ကြောင်းချင်းစီ ထည့်သွင်း စစ်ဆေးနိုင်ပါသည်။
          </p>
        </div>

        {/* ── Bulk Checker ── */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <label
            htmlFor="imei-input"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            IMEI Numbers <code className="text-xs text-gray-500 ms-2">*#06#</code>
          </label>
          <textarea
            id="imei-input"
            rows={5}
            placeholder={"123xxxxxxxxx456\n789xxxxxxxxx123"}
            value={imeiText}
            onChange={(e) => setImeiText(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 outline-none"
          />

          <div className="mt-4 flex items-center justify-between">
            {isCaptchaSolving ? (
              <LoadingSpinner text="Captcha ဖြေရှင်းနေသည်…" />
            ) : isChecking ? (
              <LoadingSpinner text="စစ်ဆေးနေသည်…" />
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={!canCheck}
              onClick={handleCheck}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              စစ်ဆေးမည်
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {appError && (
          <div className="mb-6">
            <ErrorCard message={appError.message} onRetry={handleRetry} />
          </div>
        )}

        {/* ── GitHub ── */}
        <div className="my-4">
          <GitHubBanner />
        </div>

        {/* ── Results ── */}
        <ResultsSection results={results} />

      </div>
    </div>
  );
}

export default CeirApp;
