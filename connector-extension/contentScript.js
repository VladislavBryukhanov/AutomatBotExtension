let botToolUrl;

let selectedItems = [];
let predictedItems = [];
let selectedActionItem = null;
let predictedActionItems = [];

const addActiveItem = (collection, item, color) => {
  collection.push(item);
  item.style.border = `${color} 2px solid`;
}

const collectPredictedItems = (payload, root) => {
  let htmlCollection;

  if (payload.classList?.length) {
    htmlCollection = root.getElementsByClassName(payload.classList.join(' '));
  } else if (payload.tagName) {
    htmlCollection = root.getElementsByTagName(payload.tagName);
  }

  const predicted = Array.from(htmlCollection).filter(node => !selectedItems.includes(node));

  selectedActionItem = Array.from(htmlCollection).find(node => !predicted.includes(node));

  return predicted;
}

const reset = () => {
  selectedItems.forEach(item => item.style.border = '');
  predictedItems.forEach(item => item.style.border = '');
  selectedItems = [];
  predictedItems = [];
}

const init = () => {
  const iframe = document.createElement("iframe");
  const app = document.body.getElementsByClassName('todo-wrapper')[0];
  const placeholder = document.body.getElementsByClassName('automation-content')[0];

  iframe.setAttribute("src", botToolUrl); 
  iframe.style.width = "100%";
  iframe.style.height = "260px";
  iframe.origin = botToolUrl;

  app.style['padding-bottom'] = iframe.style.height;

  placeholder.replaceWith(iframe);


  document.addEventListener('click', (e) => {
    const {id, tagName, classList} = e.target;

    addActiveItem(selectedItems, e.target, 'darkorange');

    iframe.contentWindow.postMessage({
      type: 'selection',
      id,
      tagName,
      classList: Array.from(classList),
    }, botToolUrl);
  });

  window.addEventListener("message", (event) => {
    switch (event.data.type) {
      case 'predictSelect': {
        collectPredictedItems(
          event.data,
          document.body
        ).forEach(item => addActiveItem(predictedItems, item, 'cyan'))
        break;
      }
      case 'elemSelect': {
        reset();
        break;
      }
      case 'actionElementSelected': {
        predictedActionItems = [];
        [...selectedItems, ...predictedItems].forEach(
          containerItem => collectPredictedItems(event.data, containerItem)
            .forEach(newItem => addActiveItem(predictedActionItems, newItem, 'yellow'))
        );
        break;
      }
      case 'applyClickAction': {
        predictedActionItems.forEach(item => item.click());
        predictedActionItems = [];
        reset();
        break;
      }
      case 'applyInputAction': {
        [selectedActionItem, ...predictedActionItems].forEach(item => item.value = event.data.inputText);
        predictedActionItems = [];
        reset();
        break;
      }
    }
  }, false);
}

chrome.runtime.onMessage.addListener((event) => {
  if (event.urlInputValue === botToolUrl) return;

  botToolUrl = event.urlInputValue;
  init();
});
