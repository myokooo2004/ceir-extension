import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()]
  }),
  manifest: {
    host_permissions: [
      'https://ceir.gov.mm/*',
      'https://raw.githubusercontent.com/*',
    ],
  },
});
