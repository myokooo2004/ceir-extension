/**
 * Cross-browser fetch that works from content scripts.
 *
 * ## Problem
 * Firefox content scripts execute `fetch()` under the **extension's principal**
 * (`moz-extension://…`), not the page's origin. Even with `credentials: 'include'`,
 * servers like Cloudflare see an alien origin and return 403.
 *
 * Chrome content scripts don't have this issue because they share the page's
 * network context.
 *
 * ## Solution
 * On Firefox, call `window.wrappedJSObject.fetch` which executes fetch with the
 * **page's principal** — exactly as if the page itself made the request.
 * `cloneInto` is used to safely pass the `init` options object from the content
 * script's scope into the page's scope.
 *
 * On Chrome (where `wrappedJSObject` doesn't exist), we fall back to regular `fetch`.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function pageFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const win = (window as any).wrappedJSObject;

  if (win?.fetch) {
    // `cloneInto` is a Firefox-only API that clones an object from the
    // content script's scope into the page's scope.
    const cloneInto = (globalThis as any).cloneInto as
      | ((obj: any, target: any) => any)
      | undefined;

    const pageInit = cloneInto ? cloneInto(init ?? {}, window) : init;
    return win.fetch(url, pageInit) as Promise<Response>;
  }

  return fetch(url, init);
}
