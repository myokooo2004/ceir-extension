export default defineBackground(() => {
  console.log('CEIR background ready', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
    if (message.type === 'FETCH_TAC_DB') {
      fetch(message.url)
        .then(res => res.json())
        .then(data => sendResponse({ data }))
        .catch(err => sendResponse({ error: String(err) }));
      return true;
    }
  });
});
