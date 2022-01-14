chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.get(['state', 'crn', 'runningTabId', 'attempts'], function (obj) {
        if (obj.state === undefined) {
            chrome.storage.local.set({
                'state': 0
            });
            // background.js set the 'state' to 0
        }
        if (obj.crn === undefined) {
            chrome.storage.local.set({
                'crn': ''
            });
            // background.js set the 'crn' to ''
        }
        if (obj.runningTabId === undefined) {
            chrome.storage.local.set({
                'runningTabId': ''
            });
            // background.js set the 'runningTabId' to ''
        }
        if (obj.attempts === undefined) {
            chrome.storage.local.set({
                'attempts': 0
            });
            // background.js set the 'attempts' to 0
        }
    });
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    chrome.storage.local.get(['runningTabId'], function (keys) {
        if (keys.runningTabId === tabId) {
            // the tab just closed is the Minerva tab in which the extension is running
            chrome.storage.local.set({
                'state': 0,
                'crn': '',
                'runningTabId': ''
            });
        }
    });
});