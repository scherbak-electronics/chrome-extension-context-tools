chrome.runtime.onMessage.addListener(({ name, data }, sender, sendresponse) => {
    if (name === 'on-text-out') {
        if (data.text_out) {
            let innerHtml = document.body.querySelector('#text_out').innerHTML;
            document.body.querySelector('#text_out').innerHTML = data.text_out + innerHtml;
        }
    }
    if (name === 'last-hover-input-updated') {
        if (data) {
            let text = data.id + '.' + data.class + '.' + data.name;
            document.body.querySelector('#last_hover_input').innerHTML = text;
        }
    }
    if (name === 'page-elements-count') {
        if (data) {
            let text = 'found inputs: ' + data;
            document.body.querySelector('#input_count').innerHTML = text;
        }
    }
    if (name === 'print-url') {
        if (data) {
            let text = '<span>' + data + '</span><br>';
            let innerHtml = document.body.querySelector('#urls').innerHTML;
            document.body.querySelector('#urls').innerHTML = text + innerHtml;
        }
    }
    sendresponse();
});


document.getElementById('test_action').addEventListener('click', () => {
    let innerHtml = document.body.querySelector('#text_out').innerHTML;
    document.body.querySelector('#text_out').innerHTML =
        '<small>Test action works fine: ' +
        Date.now() +
        '</small>' +
        innerHtml;
});
