import { renderCeirApp } from './app/main';
import { fetchAndSolveAltcha } from '@/utils/altcha';
import '../assets/tailwind.css';

export default defineContentScript({
  matches: ['https://ceir.gov.mm/check-status'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    console.log('CEIR extension loaded.');

    let mounted = false;

    const mountApp = async () => {
      if (mounted) return;
      mounted = true;

      console.log('Mounting CEIR extension app');
      // clear all webpage
      document.documentElement.innerHTML = '<head><title>CEIR Extension</title></head><body></body>';

      const ui = await createShadowRootUi(ctx, {
        name: 'ceir-app-ui',
        position: 'inline',
        anchor: 'body',
        append: 'first',
        onMount(uiContainer) {
          const wrapper = document.createElement('div');
          wrapper.id = 'root';
          uiContainer.append(wrapper);

          const { unmount } = renderCeirApp(wrapper);
          return { unmount, wrapper };
        },
        onRemove(elements) {
          elements?.unmount();
          elements?.wrapper.remove();
        },
      });

      // Mount the UI
      ui.mount();
      console.log('CEIR extension app mounted');
    };

    const isTurnstileActive = () => {
      const selectors = [
        '#challenge-running',
        '#cf-turnstile',
        '.cf-turnstile',
        '[name="cf-turnstile-response"]',
        'script[src*="cdn-cgi/challenge-platform"]',
        'iframe[src*="cloudflare"]'
      ];

      const hasElements = selectors.some(selector => !!document.querySelector(selector));
      const hasTitle = document.title === 'Just a moment...' || document.title.includes('Cloudflare') || document.title === 'Access Restricted';

      return hasElements || hasTitle;
    };

    if (isTurnstileActive()) {
      console.log('Wait');

      const checkReadyState = () => {
        return document.readyState === 'interactive' || document.readyState === 'complete';
      };

      const observer = new MutationObserver((mutations, obs) => {
        if (!isTurnstileActive() && checkReadyState()) {
          obs.disconnect();
          mountApp();
        } else if (isTurnstileActive()) {
          console.log('Waiting for Cloudflare to finish loading...');
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      document.addEventListener('readystatechange', () => {
        if (!isTurnstileActive() && checkReadyState()) {
          observer.disconnect();
          mountApp();
        }
      });
    } else {
      mountApp();
    }
  },
});
