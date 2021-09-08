async function createAudioWindow(name) {
  const url = chrome.runtime.getURL(`audio.html?${name}`);
  const { id } = await chrome.windows.create({
    type: 'popup',
    focused: false,
    top: 1,
    left: 1,
    height: 1,
    width: 1,
    url,
  });
  await chrome.windows.update(id, { focused: false });
  return id;
}

function getFirstName() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['firstName'], function(result) {
      resolve(result.firstName);
    });
  });
}

function setFirstName(firstName) {
  chrome.storage.local.set({ firstName, });
  console.log('Set name to', firstName);
}

let nameTab = undefined;

chrome.runtime.onMessage.addListener(message => {
  if (message.startsWith('firstName:')) {
    setFirstName(message.slice(10).toLowerCase());
    if (nameTab) {
      chrome.tabs.remove(nameTab.id);
    }
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.clear();
  const url = chrome.runtime.getURL('enter_name.html');
  nameTab = await chrome.tabs.create({ url });
});

let lastPlayed = undefined;
let popupId = undefined;
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const { tabId, windowId } = activeInfo;
  if (windowId === popupId) {
    return;
  }

  const hour = new Date().getHours();
  const isLate = hour >= 0 && hour < 5;
  const playedRecently = lastPlayed && (new Date() - lastPlayed) < (1000 * 60 * 60 * 24 * 7);
  const randomChance = Math.random() < 0.2;
  const hasName = !!(await getFirstName());

  const shouldPlay = hasName && randomChance && isLate && !playedRecently;

  console.log({
    isLate,
    playedRecently,
    randomChance,
    hasName,
    shouldPlay,
  });

  if (!shouldPlay) {
    return;
  }

  console.log('activated', windowId, tabId);
  setTimeout(async () => {
    console.log('--> playing');
    popupId = await createAudioWindow(await getFirstName());
    setTimeout(async () => {
      await chrome.windows.remove(popupId);
    }, 3000);
  }, 3000);
  lastPlayed = new Date();
});
