// Fetch tip & save in storage
const updateTip = async (): Promise<void> => {
  const response = await fetch("https://extension-tips.glitch.me/tips.json");
  const tips = await response.json();
  const randomIndex = Math.floor(Math.random() * tips.length);
  return chrome.storage.local.set({ tip: tips[randomIndex] });
};

const ALARM_NAME = "tip";

// Check if alarm exists to avoid resetting the timer.
// The alarm might be removed when the browser session restarts.
const createAlarm = async (): Promise<void> => {
  const alarm = await chrome.alarms.get(ALARM_NAME);
  if (typeof alarm === "undefined") {
    chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1, periodInMinutes: 1440 }); // 1 day
    updateTip();
  }
};

createAlarm();

chrome.alarms.onAlarm.addListener(updateTip);

// Send tip to content script via messaging
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.greeting === "tip") {
    chrome.storage.local.get("tip").then(sendResponse);
    return true;
  }
  return;
});
