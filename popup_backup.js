let sellersDiv = document.getElementById("sellers");
let resultsDiv = document.getElementById("searchResults");
let filterButton = document.getElementById("filter");

console.log(filterButton);

console.log(document.body);

// When the button is clicked filter the items
filterButton.addEventListener("click", async () => {

    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id,
            { from: 'popup', subject: 'DOMInfo' },
            // ...also specifying a callback to be called 
            //    from the receiving end (content script).
            showFilteredItems);
    });

    /* chrome.storage.local.get("total_elements", (data) => {
        resultsDiv.insertAdjacentHTML('beforeend', 'lala ' + data.total_elements);
    }) */
});

// https://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html
// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id,
            { from: 'popup', subject: 'DOMInfo' },
            // ...also specifying a callback to be called 
            //    from the receiving end (content script).
            showGroupedSellers);
    });
});

const showFilteredItems = data => {
    console.log(data);
    let resultsDiv = document.getElementById("searchResults");
    console.log(resultsDiv);

}

// Update the relevant fields with the new data.
const showGroupedSellers = data => {
    console.log(data);
    //console.log(sellersDiv);

    let sellersDiv = document.getElementById("sellers");

    console.log(sellersDiv);
    for (var i in data) {
        sellersDiv.insertAdjacentHTML('beforeend', '<a href="' + data[i].link + '"><h3>' + i + '</h3></a><div>Count: ' + data[i].count + '</div><div>Price: ' + data[i].price + '</div>');
    }
};


window.addEventListener('click', function (e) {
    if (e.target.href !== undefined) {
        chrome.tabs.create({ url: e.target.href })
    }
})
/* 
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        //sellersDiv.append(request);

        for (var i in request) {
            sellersDiv.insertAdjacentHTML('beforeend', '<h3>' + i + '</h3><div>Count: ' + request[i].count + '</div><div>Price: ' + request[i].price + '</div><a href="' + request[i].link + '">Click here.</a>');
        }
        console.log({ request });


        if (request.greeting === "hello")
            sendResponse({ farewell: "goodbye" });
    }
);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
        console.log(response);
    });
});
 */
