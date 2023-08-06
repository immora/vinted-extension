let sellersDiv = document.getElementById("sellers");
let resultsDiv = document.getElementById("searchResults");
let filterButton = document.getElementById("filter");

window.addEventListener('click', function (e) {
    if (e.target.href !== undefined) {
        chrome.tabs.create({ url: e.target.href })
    }
})

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

});

function filterFavs(e){
    e.preventDefault();
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
}

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
    console.log("showFilteredItems:")
    console.log(data.allFavoritedItems);
    let resultsDiv = document.getElementById("searchResults");
    console.log(resultsDiv);

    // clear results div
    resultsDiv.innerHTML = "";

    let query = document.getElementById("queryValue");
    console.log("query: " + query.value);

    let filterResults = getAllItems(query.value, data.allFavoritedItems);
    console.log({filterResults});

    for (var i in filterResults) {
        resultsDiv.insertAdjacentHTML('beforeend', '<div class="filterResult"><a href="' + filterResults[i].itemLink + '" target="_blank"><img src="' + filterResults[i].itemImage + '" /><h3>' + filterResults[i].itemTitle + '</h3><div>Price: ' + filterResults[i].itemPrice + '</div><div>From this seller: ' + filterResults[i].seller.count + ' ('+ filterResults[i].seller.name + ')</div></a>');
        if (filterResults[i].isSoldOut)
        {
            resultsDiv.insertAdjacentHTML('beforeend', '<div>Sprzedane!!</div>')
        }
        resultsDiv.insertAdjacentHTML('beforeend', '</div>')
    }

}

// Update the relevant fields with the new data.
const showGroupedSellers = data => {
    console.log({data})
    console.log(data.orderedSellers);
    //console.log(sellersDiv);

    let sellersDiv = document.getElementById("sellers");

    console.log(sellersDiv);

    //let orderedSellers = data.orderedSellers. todo: sorting alphabetically
    for (var i in data.orderedSellers) {
        sellersDiv.insertAdjacentHTML('beforeend', '<a href="' + data.orderedSellers[i].link + '" target="_blank"><h3>' + data.orderedSellers[i].name + '</h3></a><div>Count: ' + data.orderedSellers[i].count + '</div><div>Price: ' + data.orderedSellers[i].price + '</div>');
    }
};

function getAllItems(query, data) {
    let itemsArray = [];
    let queriesOr = query.split(',');
    let queriesAnd = query.split(' ');

    let isAndQuery = query.indexOf(',') === -1;

    data.forEach(favoritedItem => {
        let itemTitle = favoritedItem.itemTitle;
        let itemSize = favoritedItem.itemSize
        let itemBrand = favoritedItem.itemBrand

        let shouldAdd = false;

        if (isAndQuery)
        {
            if (includesAllQueries(itemTitle, queriesAnd)){
                shouldAdd = true;
            }
        }
        else if (includesAnyQuery(itemTitle, queriesOr) || includesAnyQuery(itemSize, queriesOr) || includesAnyQuery(itemBrand, queriesOr))
        {
            shouldAdd = true;
        }
        
        if (shouldAdd)
        {
                let itemLink = favoritedItem.itemLink;
                let itemImage = favoritedItem.itemImage;
                let itemPrice = favoritedItem.itemPrice
                let seller = favoritedItem.seller;
    
                itemsArray.push({
                    itemTitle,
                    itemLink,
                    itemImage,
                    itemPrice,
                    itemSize,
                    itemBrand,
                    seller
                })
        }
    })

    return itemsArray;
}

function includesAnyQuery(title, queries){
    var hasAny = queries.some(query=>title.toLowerCase().includes(query.trim().toLowerCase()));
    return hasAny;
}

function includesAllQueries(title, queries){
    var isEvery = queries.every(query => title.toLowerCase().includes(query.trim().toLowerCase()));
    return isEvery;
}

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
