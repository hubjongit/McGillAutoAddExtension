updatePopup()

let ready = false

chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {

    var tab = tabs[0];
    var url = tab.url
    if (url !== "https://horizon.mcgill.ca/pban1/bwskfreg.P_AltPin" && url !== "https://horizon.mcgill.ca/pban1/bwckcoms.P_Regs") {
        var error_message = "Sorry, please:<ul><li>Navigate to the Minerva > Student > Registration Menu > Quick Add or Drop Course Sections</li><li>Refresh the page</li><li>Reopen the extension</li></ul>"
        document.getElementById('error').innerHTML = error_message
        document.getElementById('crn_value').disabled = true
        document.getElementById('crn_submit').disabled = true
    } else {
        document.getElementById('error').innerHTML = ""
        document.getElementById('crn_value').disabled = false
        document.getElementById('crn_submit').disabled = false
        chrome.tabs.sendMessage(tabs[0].id, {ready: 'getStatus'}, function (response) {
            console.log("Ready response from autoadd: " + response.response)
            ready = response.response
        });
    }
});


function updatePopup() {
    chrome.storage.local.get(['state', 'crn', 'found'], function (obj) {
        console.log('State setting retrieved from storage ' + obj.state);
        document.getElementById('crn_submit').value = obj.state;
        console.log('CRN setting retrieved from storage ' + obj.crn);
        document.getElementById('crn_value').value = obj.crn;
        if (obj.state === 'Stop') {
            console.log('obj.state is stop so text shoudl be disabled')
            document.getElementById('crn_value').disabled = true;
        } else if (obj.state === 'Run') {
            document.getElementById('crn_value').disabled = false;
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById("crn_form")
    form.addEventListener('submit', function (e) {
        e.preventDefault()

        let state = document.getElementById('crn_submit').value
        let crn = document.getElementById('crn_value').value

        if (state === 'Run') {
            state = 'Stop'
            document.getElementById('crn_submit').value = state;
            document.getElementById('crn_value').disabled = true;
            sendRun(state, crn)
            // probably better to have autoadd set this after receiving through message pass
            // chrome.storage.local.set({ "state": document.getElementById('crn_submit').value, "crn": document.getElementById('crn_value').value });
        } else if (state === 'Stop') {
            state = 'Run'
            document.getElementById('crn_submit').value = state;
            document.getElementById('crn_value').disabled = false;
            sendStop(state)
            // chrome.storage.local.set({ "state": document.getElementById('crn_submit').value });
        }
    })
});


function sendRun(state, crn) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {state: state, crn: crn}, function (response) {
            if (!response.response) {
                document.getElementById('crn_submit').value = 'Run';
                document.getElementById('crn_value').disabled = false;
            } else {
                updatePopup()
            }
            //TODO if response is good stay, if not enable the fields again and change back to 'Run'???
            //see implementation... ^^^^
        });
    });
}

function sendStop(state) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {state: state}, function (response) {
            if (!response.response) {
                document.getElementById('crn_submit').value = 'Run';
                document.getElementById('crn_value').disabled = false;
            } else {
                updatePopup()
            }
            //TODO is there a similar response needed as the sendRun()?
        });
    });
}