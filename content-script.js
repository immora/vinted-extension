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

    const testDataAttributeName = "data-testid";
    const testDataAttributeGridItemValue = "grid-item";
    const testDataAttributeProductItemIdPrefixValue = "product-item-id-"; // "product-item-id-3295194586"

    const testDataAttributeOwnerValue = "--owner-name"; //"product-item-id-3295194586--owner-name";
    const testDataAttributeOverlayLinkValue = "--overlay-link"; // "product-item-id-3295194586--overlay-link"
    const testDataAttributeImageValue = "--image"; // "product-item-id-3295194586--image"
    const testDataAttributePriceValue = "--price-text"; // "product-item-id-3295194586--price-text"
    const testDataAttributeSizeValue = "--description-title"; // "product-item-id-3295194586--description-title"
    const testDataAttributeBrandValue = "--description-subtitle"; // "product-item-id-3295194586--description-subtitle"

    let favoritedItemsNodes = document.querySelectorAll(`[${testDataAttributeName}="${testDataAttributeGridItemValue}"]`)

    let countSeller = {};
    let allFavoritedItems = [];

    let favoritedItemsArray = Array.from(favoritedItemsNodes);
    favoritedItemsArray.forEach(favoritedItem => {

        let productItemIdNode = favoritedItem.querySelector(`[${testDataAttributeName}^="${testDataAttributeProductItemIdPrefixValue}"]`);
        let itemId = productItemIdNode.getAttribute(`${testDataAttributeName}`);

        let itemOwner = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributeOwnerValue}"]`)?.textContent ?? '';
        let itemLink = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributeOverlayLinkValue}"]`)?.href ?? '';
        let itemImage = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributeImageValue}"] img`)?.src ?? '';
        let itemTitle = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributeImageValue}"] img`)?.alt ?? '';
        let itemPrice = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributePriceValue}"]`)?.textContent ?? '';
        let itemSize = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributeSizeValue}"]`)?.textContent ?? '';
        let itemBrand = productItemIdNode.querySelector(`[${testDataAttributeName}^="${itemId}${testDataAttributeBrandValue}"]`)?.textContent ?? '';
        let isSoldOut = favoritedItem.querySelector('div[class^="new-item-box__overlay"] div[class^="web_ui__Cell__success"]') ? true : false;

        if (!isSoldOut) {
            // initialize seller object if not already initialized
            countSeller[itemOwner] = countSeller[itemOwner] || { name: itemOwner, count: 0, price: 0, link: '' };
            countSeller[itemOwner].count += 1;
            countSeller[itemOwner].price += parseInt(itemPrice);
            countSeller[itemOwner].link = itemLink;

            allFavoritedItems.push({
                itemTitle,
                itemLink,
                itemImage,
                itemPrice,
                itemSize,
                itemBrand,
                isSoldOut,
                seller: {
                    name: itemOwner,
                    link: countSeller[itemOwner].link
                }
            })
        }
    });

    // add count and price to seller object
    Object.entries(countSeller).forEach(([k, v]) => {
        allFavoritedItems.forEach(item => {
            if (item.seller.name === k) {
                item.seller = {
                    ...item.seller,
                    count: v.count,
                    price: v.price
                }
            }
        })
    })

    // sort sellers by name
    let orderedSellers = Object.values(countSeller).sort(function (a, b) {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    console.log({ countSeller });
    console.log({ orderedSellers });
    console.log({ allFavoritedItems });

    return { orderedSellers, allFavoritedItems };
}

chrome.runtime.sendMessage({
    total_elements: 'whatever' // or whatever you want to send
});

