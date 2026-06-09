import type { ImeiCheckResult } from '@/utils/types';
import { formatResultForClipboard } from '@/utils/copy-format';
import StatusBadge from './StatusBadge';
import DeviceInfoCard from './DeviceInfoCard';
import CopyButton from './CopyButton';

interface ResultCardProps {
  result: ImeiCheckResult;
  deviceTitle: string | null;
  isDeviceInfoOpen: boolean;
  onToggleDeviceInfo: () => void;
}

function getPaymentStateLabel(state: string): string {
  switch (state) {
    case 'PAID':
    case 'ACCUMULATION':
      return 'ဆောင်ပြီး';
    case 'UNPAID':
      return 'မဆောင်ရသေး';
    case 'AMNESTY':
      return 'ကန့်သတ်ချက်ဖြင့်ခွင့်ပြုထားသည့်ပစ္စည်း';
    default:
      return 'မသိရ';
  }
}

function getPaymentStateVariant(state: string): 'success' | 'danger' | 'warning' | 'neutral' {
  switch (state) {
    case 'PAID':
    case 'ACCUMULATION':
      return 'success';
    case 'UNPAID':
      return 'danger';
    case 'AMNESTY':
      return 'warning';
    default:
      return 'neutral';
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

export default function ResultCard({ result, deviceTitle, isDeviceInfoOpen, onToggleDeviceInfo }: ResultCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatResultForClipboard(result));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {deviceTitle && (
        <div className="px-4 pt-4 pb-0">
          <h2 className="text-base font-bold text-gray-900">{deviceTitle}</h2>
        </div>
      )}

      <div className="p-4 sm:p-5">
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

        <dl className="space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-500">အခွန်ဆောင်ပြီးစီးမှု အခြေအနေ</dt>
            <dd>
              <StatusBadge
                label={getPaymentStateLabel(result.paymentState)}
                variant={getPaymentStateVariant(result.paymentState)}
              />
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-500">ကွန်ရက်တွင် ချိတ်ဆက်ခွင့်</dt>
            <dd>
              <StatusBadge
                label={result.blockState === null || result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်'}
                variant={result.blockState === null || result.blockState === 'BLOCKED' ? 'danger' : 'success'}
              />
            </dd>
          </div>

          {result.networkDate && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-500">စာရင်းသွင်းထားသောရက်</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(result.networkDate)}
              </dd>
            </div>
          )}
        </dl>

        {result.deviceInfo && (
          <div className="mt-4">
            <DeviceInfoCard
              deviceInfo={result.deviceInfo}
              isOpen={isDeviceInfoOpen}
              onToggle={onToggleDeviceInfo}
            />
          </div>
        )}
      </div>
    </div>
  );
}
