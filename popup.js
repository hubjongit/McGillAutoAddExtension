updatePopup()

function updatePopup() {
    let state_button_text = ['Run', 'Stop']
    chrome.storage.local.get(['state', 'crn'], function (keys) {
        document.getElementById('crn_submit').value = state_button_text[keys.state]
        document.getElementById('crn_value').value = keys.crn

        chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
            var tab = tabs[0];
            var url = tab.url
            if (url === "https://horizon.mcgill.ca/pban1/bwskfreg.P_AltPin" || url === "https://horizon.mcgill.ca/pban1/bwckcoms.P_Regs") {
                if (keys.state === 1) {
                    // running, yes url, ready
                    document.getElementById('error').innerHTML = ""
                    document.getElementById('crn_value').disabled = true
                    document.getElementById('crn_submit').disabled = false
                } else if (keys.state === 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {ready: 'get'}, function (response) {
                        if (chrome.runtime.lastError) {
                            // stopped, yes url, not ready
                            // Script is not injected and not ready for use. Refreshing... open the extension again once page is reloaded!
                            document.getElementById('error').innerHTML = "Sorry, if the page does not refresh automatically in 3 seconds, please:<ul><li>Refresh the page</li><li>Reopen the extension</li></ul>"
                            document.getElementById('crn_value').disabled = true
                            document.getElementById('crn_submit').disabled = true
                            setTimeout(function () {
                                window.close()
                                chrome.tabs.reload(tabs[0].id);
                            }, 3000);
                        } else if (response.ready) {
                            // stopped, yes url, ready
                            // Script is injected and ready for use...
                            document.getElementById('error').innerHTML = ""
                            document.getElementById('crn_value').disabled = false
                            document.getElementById('crn_submit').disabled = false
                        }
                    });
                }
            } else {
                if (keys.state === 1) {
                    //running, not url, ready
                    document.getElementById('error').innerHTML = "Sorry, please return to the Minerva page in order to Stop."
                    document.getElementById('crn_value').disabled = true
                    document.getElementById('crn_submit').disabled = true
                } else if (keys.state === 0) {
                    //stopped, not url, not ready || ready
                    document.getElementById('error').innerHTML = "Sorry, please:<ul><li>Navigate to the Minerva > Student > Registration Menu > Quick Add or Drop Course Sections</li><li>Refresh the page</li><li>Reopen the extension</li></ul>"
                    document.getElementById('crn_value').disabled = true
                    document.getElementById('crn_submit').disabled = true
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById("crn_form")
    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const crn_value = parseInt(document.getElementById('crn_value').value)
        const state_button = document.getElementById('crn_submit').value

        if (!Number.isInteger(crn_value) || crn_value < 0) {
            document.getElementById('error').innerHTML = "Invalid Input: CRN must be a positive integer!"
            return;
        } else {
            document.getElementById('error').innerHTML = ""
        }

        if (state_button === 'Run') {
            let newState = 1
            chrome.storage.local.set({
                'state': newState,
                'crn': crn_value,
            });
            updatePopup()
            sendNewState(newState)
        } else if (state_button === 'Stop') {
            let newState = 0
            chrome.storage.local.set({
                'state': newState,
                'crn': ''
            });
            updatePopup()
            sendNewState(newState)
        }
    })
});

function sendNewState(newState) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {newState: newState}, function (response) {
            if (response.valid) {
                if (response.type === newState) {
                    // New state successfully received by script.
                    if (response.type === 1) {
                        chrome.storage.local.set({
                            'runningTabId': tabs[0].id
                        });
                    } else if (response.type === 0) {
                        chrome.storage.local.set({
                            'runningTabId': ''
                        });
                    }
                } else {
                    // New state received by script does not match request...
                }
            } else {
                // New state message not received by script'
                document.getElementById('crn_submit').value = 'Run'
                document.getElementById('crn_value').value = ''
                document.getElementById('crn_value').disabled = false
            }
        });
    });
}