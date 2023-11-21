const EXT_ID = 'kglkeidmcinfdcgeolcbbadihlimkppl';
let elements = document.getElementsByTagName('input');
let inputAttributes = ['name', 'class', 'id', 'placeholder', 'value'];
console.log('elements: ', elements);
let countElements = 0;
function sendToSidePanel(data) {
    chrome.runtime.sendMessage(EXT_ID, {
        name: 'on-text-out',
        data: {
            text_out: data
        }
    });
}
for (const key in elements) {
    console.log('element: ', elements[key]);

    elements[key].onclick = (event) => {
        chrome.runtime.sendMessage(EXT_ID, {
            name: 'on-text-out',
            data: {
                text_out: "from content page inputs"
            }
        });
    };
    elements[key].onmouseover = (event) => {
        chrome.runtime.sendMessage({
            name: 'set-last-hover-input',
            inputAttributes: {
                name: event.currentTarget.getAttribute('name'),
                class: event.currentTarget.getAttribute('class'),
                placeholder: event.currentTarget.getAttribute('placeholder'),
                value: event.currentTarget.getAttribute('value'),
                id: event.currentTarget.getAttribute('id')
            }
        }).then(() => {
            console.log('hover handeled');
        });
    };
    countElements++;
}
chrome.runtime.sendMessage({
    name: 'page-elements-count',
    countElements: countElements
});
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    sendToSidePanel(JSON.stringify(msg, null, 2));
    let selector = '';
    if (msg.name === 'insert-to-input') {
        if (msg.data.id) {
            selector = '#' + msg.data.id;
        } else {
            if (msg.data.class) {
                selector = '.' + msg.data.class;
            } else {
                if (msg.data.name) {
                    selector = 'input[name="' + msg.data.name + '"]';
                }
            }
        }
        if (selector) {
            document.body.querySelector(selector).value = 'insert ' + msg.data.name + msg.data.id + msg.data.class;
        }
    }

    sendResponse();
});

