chrome.runtime.onMessage.addListener(({ name, data }) => {
    if (name === 'on-text-out') {
      if (data.request_status) {
        document.body.querySelector('#request_status').innerText = data.request_status;
      }
    
      if (data.request_url) {
        document.body.querySelector('#request_url').innerText += data.request_url;
      }
      if (data.text_out) {
        document.body.querySelector('#text_out').innerText += data.text_out;
      }
    }
  });

document.getElementById('test_action').addEventListener('click', () => {
    document.body.querySelector('#text_out').innerHTML += '<small>Test action works fine: ' +  Date.now() + '</small>';
});
