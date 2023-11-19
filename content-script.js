let mouseoverFlag = false;
const EXT_ID = 'kglkeidmcinfdcgeolcbbadihlimkppl';
let elements = document.getElementsByTagName('input');
console.log('elements: ', elements);
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
        if (!mouseoverFlag) {
            chrome.runtime.sendMessage(EXT_ID, {
                name: 'on-text-out',
                data: {
                    text_out: "."
                }
            });
        }
    };
}


