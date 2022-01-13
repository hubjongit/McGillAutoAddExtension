chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.local.get(['state', 'crn', 'found'], function (obj) {
        if (obj.state === undefined) {
            chrome.storage.local.set({
                'state': 'Run',
            });
            console.log("background.js set the 'state' to 'Run'")
        }
        if (obj.crn === undefined) {
            chrome.storage.local.set({
                'crn': '',
            });
            console.log("background.js set the 'crn' to ''")
        }
        if (obj.found === undefined) {
            chrome.storage.local.set({
                'found': false,
            });
            console.log("background.js set the 'found' to 'false'")
        }
    });
});