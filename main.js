chrome.runtime.onInstalled.addListener(() => {
    // default state goes here
    // this runs ONE TIME ONLY (unless the user reinstalls your extension)
    console.log('this runs ONE TIME ONLY (unless the user reinstalls your extension)');
    setupContextMenu();
});

// setting state
chrome.storage.local.set({ default_feature_key: "changeplan"}, function () {
    console.log('inside storage.local.set');
});

// getting state
chrome.storage.local.get("default_feature_key", function (retrieved_data) {
    console.log('state: ', retrieved_data);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('changeInfo.status: ', changeInfo.status);
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    }
});

function loginToFeatureFlow() {
    let popUp = document.querySelector('#js--banner');
    console.log('loginToFeatureFlow popUp: ', popUp);
    popUp.parentNode.removeChild(popUp);
}
function pageLoad() {
    console.log('pageLoad');
    setTimeout(() => {
        loginToFeatureFlow();
        console.log('2 sec after page load...');
    }, 2000);
}

chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.log('web request completed: ', details);
        sidePanelPrintLine(details);
    },
    {
        urls: ["http://*.com/*", "https://*.com/*"]
    },
    ['responseHeaders']
);

chrome.action.onClicked.addListener(function (tab) {
    if (tab.url.startsWith('http')) {
        sidePanelPrintLine("tab clicked: " + tab.url);
      chrome.debugger.attach({ tabId: tab.id }, '1.2', function () {
        chrome.debugger.sendCommand(
          { tabId: tab.id },
          'Network.enable',
          {},
          function () {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          }
        );
      });
    } else {
      console.log('Debugger can only be attached to HTTP/HTTPS pages.');
    }
  });
  
  chrome.debugger.onEvent.addListener(function (source, method, params) {
    sidePanelPrintLine("from debuger: " + params.response + source + method);
    if (method === 'Network.responseReceived') {
      console.log('Response received, Perform your desired action with the response data:', params.response);
      sidePanelPrintLine("from debuger: " + params.response);
    
      // Perform your desired action with the response data
    }
  });

  function setupContextMenu() {
        chrome.contextMenus.create({
            id: 'dish_inspect',
            title: 'Dish Inspect',
            contexts: ['selection']
        });
        chrome.contextMenus.create({
            id: 'insert_user_name_esttest',
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
    chrome.runtime.sendMessage({
      name: 'on-text-out',
        data: { 
            text_out: "from context menu" 
        }
    });
      chrome.runtime.sendMessage({
          name: 'on-text-out',
          data: {
              text_out: JSON.stringify(data, null, 2)
          }
      });
  });

function sidePanelPrintLine(text) {
    chrome.runtime.sendMessage({
        name: 'on-text-out',
          data: { 
              text_out: text
          }
      });
}

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    sidePanelPrintLine(request.data.text_out);
});