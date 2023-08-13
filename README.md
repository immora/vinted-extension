# vinted-extension
Vinted Chrome Extension - group and filter your favorite items

# Local development
<!-- How to run locally chrome extension? -->
1. Go to chrome://extensions/
2. Enable developer mode
3. Click on "Load unpacked" and select the folder with the extension

## Testing in Chrome (console tab)
1. Go to the bottom of Favorites page:
```
var scrollInterval = setInterval(function() { 
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
}, 50);
```
2. Create function to stop scrolling:
```
var stopScroll = function() { clearInterval(scrollInterval); };
```
3. Stop scrolling when reaching bottom of the page:
```
stopScroll()
```

# Attributions
<a href="https://www.flaticon.com/free-icons/clothes" title="clothes icons">Clothes icons created by Freepik - Flaticon</a>