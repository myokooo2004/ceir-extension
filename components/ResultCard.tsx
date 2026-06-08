import { useState, useEffect } from 'react';
import type { ImeiCheckResult } from '@/utils/types';
import { formatResultForClipboard } from '@/utils/copy-format';
import { getCleanDeviceName } from '@/utils/device-name'; // ဒီ Import လေး လိုပါတယ်
import StatusBadge from './StatusBadge';
import DeviceInfoCard from './DeviceInfoCard';
import CopyButton from './CopyButton';

interface ResultCardProps {
  result: ImeiCheckResult;
  isDeviceInfoOpen: boolean;
  onToggleDeviceInfo: () => void;
}

// ... (getPaymentStateLabel, getPaymentStateVariant, formatDate functions တွေ အတိုင်းထားပါ) ...

export default function ResultCard({ result, isDeviceInfoOpen, onToggleDeviceInfo }: ResultCardProps) {
  const [deviceTitle, setDeviceTitle] = useState<string | null>(null);

  useEffect(() => {
    getCleanDeviceName(result.IMEI).then(setDeviceTitle);
  }, [result.IMEI]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatResultForClipboard(result));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ဒီနေရာမှာ Title အသစ်ထည့်ထားတယ် */}
      {deviceTitle && (
        <div className="px-4 pt-4 pb-0">
          <h2 className="text-base font-bold text-gray-900">{deviceTitle}</h2>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CopyButton onCopy={handleCopy} title="Copy result" />
            <h3 className="font-mono text-sm font-semibold text-gray-900">
              {result.IMEI}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <StatusBadge
              label={result.WrongFormat || result.Incorrect ? 'IMEI မှားယွင်းသည်' : 'IMEI မှန်ကန်သည်'}
              variant={result.WrongFormat || result.Incorrect ? 'danger' : 'success'}
            />
          </div>
        </div>

        {/* Info rows ... (မူရင်းအတိုင်း) ... */}
        
        {/* Device Info */}
        {result.deviceInfo && (
          <div className="mt-4">
            <DeviceInfoCard deviceInfo={result.deviceInfo} isOpen={isDeviceInfoOpen} onToggle={onToggleDeviceInfo} />
          </div>
        )}
      </div>
    </div>
  );
}
