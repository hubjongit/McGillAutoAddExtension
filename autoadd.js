const DELAY = 30000 // in ms
const MAX_ATTEMPTS = 600
var tryTimer;

chrome.storage.local.get(['state', 'crn'], function (keys) {
    if (keys.state === 1) {
        tryToAdd(keys.crn)
    }
});

function tryToAdd(crn) {
    var found;

    var table = document.getElementsByClassName('datadisplaytable')[0];
    for (var i = 1, row; row = table.rows[i]; i++) {
        if (parseInt(row.cells[2].innerText) === crn) {
            // course has been successfully added
            found = true
            chrome.storage.local.set({'state': 0, 'crn': ''});
            alert("MCGILL COURSE AUTO QUICK ADD EXTENSION MANAGER\n\nCourse added! Enjoy the semester ;)")
            return false;
        }
    }

    // course could not be added during this attempt
    if (!found) {
        tryTimer = setTimeout(function () {
            chrome.storage.local.get(['attempts'], function (keys) {
                // Extension will safely not exceed the maximum allowable attempts by Minerva that would lock user out
                if (keys.attempts < MAX_ATTEMPTS) {
                    chrome.storage.local.set({'attempts': parseInt(keys.attempts) + 1});
                } else {
                    // In the case that it will exceed, script is stopped and extension is reset
                    chrome.storage.local.set({'state': 0, 'crn': ''});
                    alert("MCGILL COURSE AUTO QUICK ADD EXTENSION MANAGER\n\nMax allowable attempts reached! Running this script beyond this point puts your Minerva account at risk of being flagged for too many requests which will require contacting a Service Point to resolve. Proceed at your own risk.\n\n(hint: reinstall to reset counter)")
                    return false;
                }
            });
            document.getElementById('crn_id1').value = crn
            Array.from(document.getElementsByName('REG_BTN')).find(element => element.value === 'Submit Changes').click()
        }, DELAY);
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.ready === 'get') {
        // Script injection status requested by popup via message, responding true...
        sendResponse({
            ready: true
        });
        return true;
    }

    chrome.storage.local.get(['state', 'crn'], function (keys) {
        if (keys.state === message.newState) {
            if (keys.state === 1) {
                sendResponse({
                    valid: true,
                    type: 1
                });
                tryToAdd(keys.crn);
                return true;
            } else if (keys.state === 0) {
                clearTimeout(tryTimer)
                sendResponse({
                    valid: true,
                    type: 0
                });
                return true;
            }
        }
        sendResponse({
            valid: false,
            type: -1
        });
    });
    return true;
});