// https://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html
// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        // Collect the necessary data. 
        // (For your specific requirements `document.querySelectorAll(...)`
        //  should be equivalent to jquery's `$(...)`.)
        var domInfo = readDom();

        // Directly respond to the sender (popup), 
        // through the specified callback.
        response(domInfo);
    }
});

function readDom() {
    console.log("Reading DOM!");

    let allFavsGroupedBySellers = [];

    let allSellers = document.querySelectorAll('div[class^="ItemBox_owner__"] h4')
    let allFavorites = document.querySelectorAll('div[class^="ItemBox_box__"]')

    function groupBy(data, key) {
        return data.reduce((acc, cur) => {
            acc[cur[key]] = acc[cur[key]] || []; // if the key is new, initiate its value to an array, otherwise keep its own array value  
            acc[cur[key]].push(cur);
            return acc;
        }, [])
    }

    var eliminateDuplicates = function (array) {
        return array.reduce(function (total, member) {
            if (total.indexOf(member) === -1) total.push(member);
            return total;
        }, []);
    };

    let allSellersArray = Array.from(allSellers);
    let allSellersNames = allSellersArray.map(x => x.innerText)

    let countSeller = allSellersNames.reduce((o, key) => (
        {
            ...o,
            [key]: {
                count: 0,
                price: 0,
                link: ''
            }
        }), {})

    let allFavoritesArray = Array.from(allFavorites);
    allFavoritesArray.forEach(favoritedItem => {
        let itemOwner = favoritedItem.querySelector('div[class^="ItemBox_owner__"] h4').innerText
        countSeller[itemOwner].count += 1;

        let itemPrice = favoritedItem.querySelector('div[class^="ItemBox_title__"] h3').innerText.split(' ')[0];
        countSeller[itemOwner].price += Number.parseInt(itemPrice);

        let ownerLink = favoritedItem.querySelector('div[class^="ItemBox_owner__"] a').href;
        countSeller[itemOwner].link = ownerLink;
    });

    console.log(countSeller);
    return countSeller;
}

chrome.runtime.sendMessage({
    total_elements: 'whatever' // or whatever you want to send
  });
