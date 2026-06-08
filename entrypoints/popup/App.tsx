import ceirExtLogo from '@/assets/ceir-ext.svg';
import GitHubBanner from '@/components/GitHubBanner';

const CEIR_URL = 'https://ceir.gov.mm/check-status';

function App() {
  const openCeir = () => {
    browser.tabs.create({ url: CEIR_URL });
  };

  return (
    <div className="flex min-h-90 w-72 flex-col items-center justify-between gap-6 bg-gray-50 p-6">
      {/* Logo */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <img
          src={ceirExtLogo}
          alt="CEIR Extension logo"
          className="h-20 w-20 drop-shadow-md"
        />
        <div className="text-center">
          <h1 className="text-base font-bold tracking-tight text-gray-900">
            CEIR Extension
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            IMEI များကို တစ်ကြောင်းချင်းစီ ထည့်သွင်း စစ်ဆေးနိုင်ပါသည်။
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={openCeir}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          {/* External link icon */}
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
          </svg>
          IMEI စစ်ဆေးမည်
        </button>

        <GitHubBanner />
      </div>
    </div>
  );
}

export default App;
