// utils/device-name.ts

const TAC_URL = 'https://raw.githubusercontent.com/myokooo2004/tac-db/main/tac.json';

let cachedTacData: Record<string, string> | null = null;

/**
 * နာမည်ထဲက ထပ်နေတဲ့ စကားလုံးတွေကို ဖြုတ်ပေးခြင်း
 */
export function cleanDeviceName(deviceName: string): string {
  if (!deviceName) return "";
  const parts = deviceName.split(' ');
  const uniqueParts = [...new Set(parts)];
  return uniqueParts.join(' ');
}

/**
 * Extension content script ထဲမှာ fetch လုပ်ရင်
 * Firefox မှာ wrappedJSObject ကနေ page fetch သုံးရတာ
 * Chrome မှာ plain fetch သုံးနိုင်တယ်
 */
async function safeFetch(url: string): Promise<Response> {
  const w = (window as any).wrappedJSObject;
  if (w?.fetch) {
    return w.fetch(url);
  }
  return fetch(url);
}

/**
 * TAC DB ကနေ IMEI နဲ့ ကိုက်ညီတဲ့ Device နာမည်ကို Fetch လုပ်ပေးခြင်း
 */
export async function getCleanDeviceName(imei: string): Promise<string | null> {
  try {
    if (!cachedTacData) {
      const response = await safeFetch(TAC_URL);
      if (!response.ok) return null;
      cachedTacData = await response.json();
    }

    if (!cachedTacData) return null;

    const tac = imei.substring(0, 8);
    const deviceName = cachedTacData[tac];

    if (!deviceName) return null;

    return cleanDeviceName(deviceName);
  } catch (error) {
    console.error("Failed to fetch device name:", error);
    return null;
  }
}
