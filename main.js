let lastHoverInput = {};
chrome.runtime.onInstalled.addListener(() => {
    // default state goes here
    // this runs ONE TIME ONLY (unless the user reinstalls your extension)
    console.log('chrome.runtime.onInstalled');
    setupContextMenu();
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
     .catch((error) => console.error(error));

// setting state
chrome.storage.local.set({ default_feature_key: "changeplan"}, function () {
    console.log('inside storage.local.set');
});

// getting state
chrome.storage.local.get("default_feature_key", function (retrieved_data) {
    console.log('state: ', retrieved_data);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('chrome.tabs.onUpdated: ', tab);
    let pageId = getPageId(tabId);
});


chrome.webRequest.onCompleted.addListener((details) => {
    console.log('chrome.webRequest.onCompleted: ', details);
    sidePanelPrintUrl(details.url);
}, {urls: ["<all_urls>"]}, ['responseHeaders']);

// click icon in extensions toolbar, inject content script
chrome.action.onClicked.addListener(function (tab) {
    console.log('action (tab): ', tab);
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content-script.js']
    });
    chrome.sidePanel.open({ windowId: tab.windowId });

});
  
function getPageId(tabId) {
    return '';
}

function setupContextMenu() {
    chrome.contextMenus.create({
        id: 'dish_inspect',
        title: 'Dish Inspect',
        contexts: ['selection']
    });
    chrome.contextMenus.create({
        id: 'insert_email',
        title: 'esttest@username.com',
        contexts: ['editable']
    });
    chrome.contextMenus.create({
        id: 'insert_user_name_wer',
        title: 'wer@username.com',
        contexts: ['editable']
    });
}

chrome.contextMenus.onClicked.addListener((data) => {
    if (data.menuItemId === 'insert_email') {
        sidePanelPrintLine("inserting email");
        chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tab) => {
            chrome.tabs.sendMessage(tab[0].id, {
                name: "insert-to-input",
                data: lastHoverInput
            });
        });
    } else {
        sidePanelPrintLine("from context menu");
        sidePanelPrintLine(JSON.stringify(data, null, 2));
    }
});

function sidePanelPrintLine(text) {
    chrome.runtime.sendMessage({
        name: 'on-text-out',
        data: {
            text_out: text
        }
    });
}

function sidePanelPrintUrl(url) {
    chrome.runtime.sendMessage({
        name: 'print-url',
        data: url
    });
}

function sidePanelLastHoverInputUpdated(data) {
    chrome.runtime.sendMessage({
        name: 'last-hover-input-updated',
        data: data
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('sender: ', sender);
    if (request.name === 'set-last-hover-input') {
        lastHoverInput = {
            id: request.inputAttributes.id ?? '',
            class: request.inputAttributes.class ?? '',
            name: request.inputAttributes.name ?? ''
        };
        sidePanelLastHoverInputUpdated(lastHoverInput);
    }
    sendResponse();
});
