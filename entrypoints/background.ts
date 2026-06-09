export default defineBackground(() => {
  console.log('CEIR Extension background started', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'FETCH_TAC_DB') {
      fetch(message.url)
        .then(res => res.json())
        .then(data => sendResponse({ data }))
        .catch(err => sendResponse({ error: String(err) }));
      return true;
    }
  });
});
