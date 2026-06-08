import type { DeviceInfo } from '@/utils/types';
import { DEVICE_FIELDS } from '@/utils/copy-format';
import CopyButton from './CopyButton';

interface DeviceInfoCardProps {
  deviceInfo: DeviceInfo;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DeviceInfoCard({ deviceInfo, isOpen, onToggle }: DeviceInfoCardProps) {
  const handleCopy = async () => {
    const text = DEVICE_FIELDS.map(
      ({ key, label }) => `${label}: ${String(deviceInfo[key])}`
    ).join('\n');
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-700">Device Info</span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <CopyButton
          onCopy={handleCopy}
          title="Copy device info"
          className="mr-2"
        />
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 px-4 py-3">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {DEVICE_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex flex-col py-1">
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {String(deviceInfo[key])}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
