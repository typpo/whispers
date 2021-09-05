const createAudioWindow = async (name) => {
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
};

chrome.runtime.onInstalled.addListener(async () => {
  let firstName = undefined;
  chrome.identity.getAuthToken({ 'interactive': true }, async (token) => {
    const resp = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
    const json = await resp.json();
    if (!json.given_name) {
      console.error('No name found');
    } else {
      firstName = json.given_name.toLowerCase();
      console.log('Got', firstName)
    }
  });

  let lastPlayed = undefined;
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    //const hour = new Date().getHours();
    const hour = 3;
    const isLate = hour >= 0 && hour < 5;
    const playedRecently = lastPlayed && (new Date() - lastPlayed) < (1000 * 60 * 60 * 24 * 7);
    const randomChance = Math.random() < 0.2;
    const hasName = !!firstName;

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

    const { tabId, windowId } = activeInfo;
    console.log('activated', windowId, tabId);
    setTimeout(async () => {
      console.log('--> playing');
      const popupId = await createAudioWindow(firstName);
      setTimeout(async () => {
        await chrome.windows.remove(popupId);
      }, 3000);
    }, 3000);
    lastPlayed = new Date();
  });
});
