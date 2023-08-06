/* let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
}); */

// https://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html
/* chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
}); */

// IDEA: maybe use the storage? https://developer.chrome.com/docs/extensions/reference/storage/
// https://stackoverflow.com/a/20021813

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    console.log(request.total_elements);
    chrome.storage.local.set( {total_elements: request.total_elements} );
  }
);