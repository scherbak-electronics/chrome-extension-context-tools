// Saves options to chrome.storage
const saveOptions = () => {
    const defaultFeatureKey = document.getElementById('default_feature_key').value;
    const enableAutoLogin = document.getElementById('enable_auto_login').checked;
  
    chrome.storage.sync.set({ 
        defaultFeatureKey: defaultFeatureKey, 
        enableAutoLogin: enableAutoLogin 
    }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      }
    );
};
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get({ 
        defaultFeatureKey: 'changeplan', 
        enableAutoLogin: false 
    }, (items) => {
        document.getElementById('default_feature_key').value = items.defaultFeatureKey;
        document.getElementById('enable_auto_login').checked = items.enableAutoLogin;
      }
    );
};
  
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);