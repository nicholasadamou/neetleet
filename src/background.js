/**
 * Listens for messages from other parts of the extension.
 * Handles the "CHECK_NEETCODE" message to verify if a NeetCode solution exists.
 *
 * @param {Object} message - The message object sent from the sender.
 * @param {string} message.type - The type of the message (e.g., "CHECK_NEETCODE").
 * @param {string} message.slug - The problem slug to check on NeetCode.
 * @param {Object} sender - The sender of the message (e.g., content script).
 * @param {function} sendResponse - Function to send a response back to the sender.
 * @returns {boolean} - Returns `true` to keep the message channel open for async response.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CHECK_NEETCODE") {
      // Check if a problem exists on NeetCode
      const problemSlug = message.slug;
      const neetCodeUrl = `https://neetcode.io/solutions/${problemSlug}`;
  
      fetch(neetCodeUrl, { method: "HEAD" })
        .then((response) => {
          sendResponse({ exists: response.ok });
        })
        .catch((error) => {
          sendResponse({ exists: false, error: error.message });
        });
      return true; // Keep the message channel open for async response
    }
});

/**
 * Listens for updates to browser tabs and checks for navigation to LeetCode problem pages.
 *
 * @param {number} tabId - The ID of the updated tab.
 * @param {Object} changeInfo - Information about the changes to the tab.
 * @param {string} [changeInfo.url] - The updated URL of the tab.
 * @param {Object} tab - The tab object containing details about the updated tab.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes("https://leetcode.com/problems/")) {
        // Send a message to the content script
        chrome.tabs.sendMessage(tabId, { type: "URL_CHANGED", url: changeInfo.url });
    }
});

/**
 * Sets up the extension when it is installed.
 * Creates a context menu item for NeetCode solutions.
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "neetcode-solution",
        title: "🚀 View NeetCode Solution",
        contexts: ["page"],
    });
});

/**
 * Listens for clicks on context menu items and opens the NeetCode solution page if applicable.
 *
 * @param {Object} info - Information about the clicked context menu item.
 * @param {string} info.menuItemId - The ID of the clicked context menu item.
 * @param {Object} tab - The current tab where the context menu item was clicked.
 * @param {string} tab.url - The URL of the current tab.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "neetcode-solution" && tab.url.includes("leetcode.com/problems/")) {
        const problemSlug = tab.url.split("/").slice(-2, -1)[0];
        const neetCodeUrl = `https://neetcode.io/solutions/${problemSlug}`;
        chrome.tabs.create({ url: neetCodeUrl });
    }
});