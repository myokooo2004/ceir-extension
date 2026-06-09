// utils/device-name.ts

const TAC_URL = 'https://raw.githubusercontent.com/myokooo2004/tac-db/main/tac.json';

let cachedTacData: Record<string, any> | null = null;

/**
 * နာမည်ထဲက ထပ်နေတဲ့ စကားလုံးတွေကို ဖြုတ်ပေးခြင်း
 * Adjacent duplicates ဖြုတ်ပြီး Title Case လုပ်မယ်
 * ဥပမာ: "XIAOMI xiaomi 7A" -> "Xiaomi 7A"
 */
export function cleanDeviceName(deviceName: string): string {
  if (!deviceName) return "";

  const cleaned = deviceName.trim()
    .split(" ")
    .filter((w, i, a) => i === 0 || w.toLowerCase() !== a[i - 1].toLowerCase())
    .join(" ");

  return cleaned
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\B\w/g, c => c.toLowerCase());
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
    const entry = cachedTacData[tac];

    if (!entry) return null;

    // JSON မှာ object ဖြစ်နိုင်တယ် { model: "..." } သို့မဟုတ် plain string
    const raw = typeof entry === 'string'
      ? entry
      : (entry as any).model ?? '';

    if (!raw) return null;

    return cleanDeviceName(raw);
  } catch (error) {
    console.error("Failed to fetch device name:", error);
    return null;
  }
}
