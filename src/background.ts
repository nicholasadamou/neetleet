/**
 * Handles the "CHECK_NEETCODE" message to verify if a NeetCode solution exists.
 * @param {Message} message - The message object sent from the sender.
 * @param {chrome.runtime.MessageSender} sender - The sender of the message (e.g., content script).
 * @param {(response?: any) => void} sendResponse - Function to send a response back to the sender.
 * @returns {boolean} - Returns `true` to keep the message channel open for async response.
 */
chrome.runtime.onMessage.addListener(
	(message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean => {
		try {
			// Validate message type
			if (message.type !== "CHECK_NEETCODE") {
				return false;
			}

			const problemSlug = message.slug;

			// Validate the problem slug
			if (!problemSlug) {
				throw new Error("Invalid problem slug provided. Expected a non-empty string.");
			}

			// Construct the NeetCode solution URL
			const neetCodeUrl = `https://neetcode.io/solutions/${problemSlug}`;

			// Check if the solution exists using a HEAD request
			fetch(neetCodeUrl, { method: "HEAD" })
				.then((response) => {
					sendResponse({ exists: response.ok });
				})
				.catch((error) => {
					console.error(`Failed to fetch NeetCode solution for slug "${problemSlug}":`, error);
					sendResponse({ exists: false, error: error.message });
				});

			// Keep the message channel open for async response
			return true;
		} catch (error) {
			console.error("Error handling CHECK_NEETCODE message:", error);
			sendResponse({ exists: false, error: (error as Error).message });
			return true; // Ensure async response is supported
		}
	}
);

/**
 * Listens for updates to browser tabs and handles URL changes.
 * Sends a message if navigating to a LeetCode problem page or if the active tab's URL changes.
 * @param {number} tabId - The ID of the updated tab.
 * @param {chrome.tabs.TabChangeInfo} changeInfo - Information about the changes to the tab.
 * @param {chrome.tabs.Tab} tab - The tab object containing details about the updated tab.
 */
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
	try {
		// Check if the URL has changed
		if (changeInfo.url) {
			handleLeetCodePageNavigation(tabId, changeInfo.url);
			handleActiveTabUrlChange(tabId, changeInfo.url);
		}
	} catch (error) {
		console.error("Error in tabs.onUpdated listener:", error);
	}
});

/**
 * Checks if the updated URL is a LeetCode problem page and sends a message to the content script.
 * @param {number} tabId - The ID of the updated tab.
 * @param {string} url - The updated URL of the tab.
 */
function handleLeetCodePageNavigation(tabId: number, url: string): void {
	try {
		if (isLeetCodeProblemPage(url)) {
			console.log(`Navigated to LeetCode problem page: ${url}`);
			chrome.tabs.sendMessage(tabId, { type: "URL_CHANGED", url });
		}
	} catch (error) {
		console.error("Error handling LeetCode page navigation:", error);
	}
}

/**
 * Checks if the updated URL belongs to the active tab and sends a message to the content script.
 * @param {number} tabId - The ID of the updated tab.
 * @param {string} url - The updated URL of the tab.
 */
function handleActiveTabUrlChange(tabId: number, url: string): void {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
			if (activeTabs.length && activeTabs[0].id === tabId) {
				console.log(`Active tab URL changed to: ${url}`);
				chrome.tabs.sendMessage(tabId, { type: "URL_CHANGED", url });
			}
		});
	} catch (error) {
		console.error("Error detecting URL change in active tab:", error);
	}
}

/**
 * Determines if the given URL points to a LeetCode problem page.
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL is a LeetCode problem page, false otherwise.
 */
function isLeetCodeProblemPage(url: string): boolean {
	return url.startsWith("https://leetcode.com/problems/");
}
