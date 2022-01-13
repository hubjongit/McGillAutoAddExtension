/*var port;

// Attempt to reconnect
var reconnectToExtension = function () {
    // Reset port
    port = null;
    // Attempt to reconnect after 1 second
    setTimeout(connectToExtension, 1000 * 1);
};

// Attempt to connect
var connectToExtension = function () {

    // Make the connection
    port = chrome.runtime.connect({name: "my-port"});

    // When extension is upgraded or disabled and renabled, the content scripts
    // will still be injected, so we have to reconnect them.
    // We listen for an onDisconnect event, and then wait for a second before
    // trying to connect again. Becuase chrome.runtime.connect fires an onDisconnect
    // event if it does not connect, an unsuccessful connection should trigger
    // another attempt, 1 second later.
    port.onDisconnect.addListener(reconnectToExtension);

};

// Connect for the first time
connectToExtension();*/


console.log("autoadd injected")

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.ready === 'getStatus') {
        console.log("Injection status requested by popup via message, responding true...")
        sendResponse({
            response: true
        });
    }
});

function tryToAdd(crn, found) {

    // setTimeout(function () {
    var rows = $("table[class='datadisplaytable'][summary='Current Schedule']").find("tbody>tr");
    $.each(rows, function (key, value) {
        if ($(this).find("td:nth-child(3)").text() === crn) {
            console.log("FOUND! congrats ;)")
            alert("FOUND! congrats ;)")
            found = true
            chrome.storage.local.set({'found': found});
        }
    });

    if (!found) {
        console.log("didn't work out this time");

        setTimeout(function () {
            $("#crn_id1").val(crn);
            $("input[value='Submit Changes'][name='REG_BTN']").click();
        }, DELAY);
    }

    // }, 500);
}

function check() {
    chrome.storage.local.get(['state', 'crn', 'found'], function (items) {
        if (!items.found && items.state === 'Stop') {
            // tryToAdd(items.crn, items.found);
            console.log("\"tryToAdd()\"")
        } else if (items.found) {
            return;
        }
    });
}


const DELAY = 30000 // in ms

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.state !== undefined) {
        console.log("State message received: " + request.state)
        if (request.crn !== undefined) {
            console.log("CRN message received: " + request.crn)
            chrome.storage.local.set({
                'state': request.state,
                'crn': parseInt(request.crn),
                'found': false
            });
            sendResponse({
                type: 'running',
                response: true
            });
            check();
        } else {
            chrome.storage.local.set({
                'state': request.state,
            });
            sendResponse({
                type: 'stopping',
                response: true
            });
        }
    } else {
        sendResponse({
            type: 'invalid',
            response: false
        });
    }
});


//TODO dont update CRN on stopping the run, and why is it not loading back up
//TODO could maybe do 'ready' disabled through storage in background.js?