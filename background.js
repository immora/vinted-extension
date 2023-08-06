chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    console.log(request.total_elements);
    chrome.storage.local.set( {total_elements: request.total_elements} );
  }
);