// utils/device-name.ts

const TAC_URL = 'https://raw.githubusercontent.com/myokooo2004/tac-db/main/tac.json';

// Fetch လုပ်ပြီးသား Data ကို ခဏသိမ်းထားဖို့ (Performance အတွက်)
let cachedTacData: Record<string, string> | null = null;

/**
 * နာမည်ထဲက ထပ်နေတဲ့ စကားလုံးတွေကို ဖြုတ်ပေးခြင်း
 * ဥပမာ: "XIAOMI XIAOMI 7A" -> "XIAOMI 7A"
 */
export function cleanDeviceName(deviceName: string): string {
  if (!deviceName) return "";

  // စာသားတွေကို space နေရာမှာ ခွဲထုတ်ပြီး Set သုံးပြီး ထပ်နေတာဖယ်ထုတ်မယ်
  const parts = deviceName.split(' ');
  const uniqueParts = [...new Set(parts)];
  
  return uniqueParts.join(' ');
}

/**
 * TAC DB ကနေ IMEI နဲ့ ကိုက်ညီတဲ့ Device နာမည်ကို Fetch လုပ်ပေးခြင်း
 */
export async function getCleanDeviceName(imei: string): Promise<string | null> {
  try {
    // Data မရှိသေးမှ Fetch လုပ်မယ်
    if (!cachedTacData) {
      const response = await fetch(TAC_URL);
      if (!response.ok) return null;
      cachedTacData = await response.json();
    }
    
    if (!cachedTacData) return null;

    // IMEI ရဲ့ ရှေ့ 8 လုံး (TAC) ကို ယူပြီး နာမည်ရှာမယ်
    const tac = imei.substring(0, 8);
    const deviceName = cachedTacData[tac];

    if (!deviceName) return null;

    // နာမည်ကို သန့်စင်ပြီး ပြန်ပေးမယ်
    return cleanDeviceName(deviceName);
  } catch (error) {
    console.error("Failed to fetch device name:", error);
    return null;
  }
}
