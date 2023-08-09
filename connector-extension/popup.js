document.onreadystatechange = () => {
  const urlInput = document.getElementById('url_input');
  const injectButton = document.getElementById('inject_button');

  injectButton.addEventListener("submit", e => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { urlInputValue: urlInput.value });
    });
  });
}