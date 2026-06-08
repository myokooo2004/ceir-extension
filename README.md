# CEIR Extension

Bulk IMEI status and device information checker for [ceir.gov.mm](https://ceir.gov.mm).

![Preview](screenshots/screenshot_1.gif)

## Installation Guide

[Releases](https://github.com/kaungkhantjc/ceir-extension/releases) စာမျက်နှာမှ နောက်ဆုံးထွက် zip ဖိုင်ကို ဒေါင်းလုဒ်လုပ်ပြီး အောက်ပါ လမ်းညွှန်ချက်အတိုင်း ထည့်သွင်းပါ။

### Chrome

1. Releases စာမျက်နှာမှ `ceir-ext-x.x.x-chrome.zip` ကို ဒေါင်းလုဒ်လုပ်ပါ။
2. `chrome://extensions` သို့ သွားပြီး **Developer mode** ကို ဖွင့်ပါ။
3. ဒေါင်းလုဒ်ရရှိသော zip ဖိုင်ကို ဖြည်ပြီး **Load unpacked** ခလုတ်မှ ရွေးချယ်ပါ။

### Edge

1. Releases စာမျက်နှာမှ `ceir-ext-x.x.x-chrome.zip` ကို ဒေါင်းလုဒ်လုပ်ပါ။
2. `edge://extensions` သို့ သွားပြီး **Developer mode** ကို ဖွင့်ပါ။
3. ဒေါင်းလုဒ်ရရှိသော zip ဖိုင်ကို ဖြည်ပြီး **Load unpacked** ခလုတ်မှ ရွေးချယ်ပါ။

### Firefox

1. Releases စာမျက်နှာမှ `ceir-ext-x.x.x-firefox.zip` ကို ဒေါင်းလုဒ်လုပ်ပါ။
2. `about:debugging#/runtime/this-firefox` စာမျက်နှာသို့ သွားပါ။
3. **Load Temporary Add-on** ခလုတ်မှ ဒေါင်းလုဒ်ရရှိသော zip ဖိုင်ကို ရွေးချယ်ပါ။

### Mobile (Android + iOS)

1. Releases စာမျက်နှာမှ `ceir-ext-x.x.x-chrome.zip` ကို ဒေါင်းလုဒ်လုပ်ပါ။
2. [Lemur Browser](https://lemurbrowser.com) ကို ဒေါင်းလုဒ်လုပ်ပြီး ဖွင့်ပါ။
3. **Extensions** စာမျက်နှာသို့ သွားပြီး **Developer mode** ကို ဖွင့်ပါ။
4. **Load *.zip/*.crx/*.user.js file** ခလုတ်မှ ဒေါင်းလုဒ်ရရှိသော zip ဖိုင်ကို ရွေးချယ်ပါ။

## Tech Stack

- [WXT](https://wxt.dev) — Next-gen Web Extension Framework
- [React](https://react.dev) — UI library
- [Tailwind CSS](https://tailwindcss.com) v4 — Utility-first CSS
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) — Altcha PoW solver

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (Chrome)
npm run dev

# Start dev server (Firefox)
npm run dev:firefox

# Build for production
npm run build
npm run build:firefox

# Create distributable zips
npm run zip
npm run zip:firefox
```

## License

CEIR Extension is licensed under the [Apache 2.0 License](LICENSE).

```
Copyright 2026 Kaung Khant Kyaw.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
