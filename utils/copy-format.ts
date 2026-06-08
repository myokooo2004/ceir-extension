import type { DeviceInfo, ImeiCheckResult } from './types';

// ─── Shared label constants (keep in sync with ResultCard UI) ─────────────────

export const DEVICE_FIELDS: { key: keyof DeviceInfo; label: string }[] = [
  { key: 'simSlots', label: 'SIM Slots' },
  { key: 'gsmaDeviceType', label: 'Device Type' },
  { key: 'gsmaManufacturer', label: 'Manufacturer' },
  { key: 'gsmaBrandName', label: 'Brand Name' },
  { key: 'gsmaModelName', label: 'Model Name' },
  { key: 'gsmaMarketingName', label: 'Marketing Name' },
  { key: 'gsmaAllocationDate', label: 'Allocation Date' },
  { key: 'gsmaOperatingSystem', label: 'Operating System' },
  { key: 'standardisedFullName', label: 'Full Name' },
  { key: 'standardisedDeviceVendor', label: 'Device Vendor' },
  { key: 'gsmaImeiQuantitySupport', label: 'IMEI Quantity Support' },
  { key: 'standardisedDeviceModel', label: 'Device Model' },
  { key: 'standardisedMarketingName', label: 'Standardised Marketing Name' },
  { key: 'deviceAtlasID', label: 'DeviceAtlas ID' },
];

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
      return 'မသိရသေး';
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

/**
 * Serialize a single ImeiCheckResult to the clipboard plain-text format.
 */
export function formatResultForClipboard(result: ImeiCheckResult): string {
  const lines: string[] = [
    `${result.IMEI} = ${result.WrongFormat || result.Incorrect ? 'IMEI မှားယွင်းသည်' : 'IMEI မှန်ကန်သည်'}`,
    `အခွန်ဆောင်ပြီးစီးမှု အခြေအနေ = ${getPaymentStateLabel(result.paymentState)}`,
    `ကွန်ရက်တွင် ချိတ်ဆက်ခွင့် = ${result.blockState === null || result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်'}`,
    `စာရင်းသွင်းထားသောရက် = ${formatDate(result.networkDate)}`,
  ];

  if (result.deviceInfo) {
    lines.push('');
    lines.push('Device Info');
    for (const { key, label } of DEVICE_FIELDS) {
      lines.push(`${label}: ${String(result.deviceInfo[key])}`);
    }
  }

  return lines.join('\n');
}

/**
 * Serialize all results, separated by "---".
 */
export function formatAllResultsForClipboard(results: ImeiCheckResult[]): string {
  return results.map(formatResultForClipboard).join('\n\n---\n\n');
}
