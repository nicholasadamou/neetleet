// This script should only run on LeetCode problem pages (e.g., leetcode.com/problems/*)

import { createNeetCodeButton } from "@/components/NeetCodeButton";

/**
 * Extracts the problem slug from the current LeetCode URL.
 *
 * @returns {string | null} - The extracted slug, or null if the URL is invalid.
 */
const extractSlugFromURL = (): string | null => {
	const pathSegments = window.location.pathname.split("/");
	return pathSegments[2] || null;
};

/**
 * Appends the NeetCode button to the DOM if a solution exists for the given problem slug.
 *
 * @param {string} slug - The slug representing the problem (e.g., "two-sum").
 */
const appendButtonIfSolutionExists = (slug: string): void => {
	chrome.runtime.sendMessage(
		{ type: "CHECK_NEETCODE", slug },
		(response: { exists: boolean } | undefined) => {
			if (response?.exists) {
				const button = createNeetCodeButton(slug);
				document.body.appendChild(button);
			} else {
				dispatchNoSolutionEvent(slug);
			}
		}
	);
};

/**
 * Dispatches a custom event when no solution exists for the given problem slug.
 *
 * @param {string} slug - The slug representing the problem (e.g., "two-sum").
 */
const dispatchNoSolutionEvent = (slug: string): void => {
	const event = new CustomEvent<string>("NO_NEETCODE_SOLUTION", { detail: slug });
	document.dispatchEvent(event);
};

/**
 * Initializes the script by extracting the problem slug and appending the button if applicable.
 */
const init = (): void => {
	if (!document.querySelector("#neetcode-button")) {
		const slug = extractSlugFromURL();
		if (!slug) {
			return;
		}

		appendButtonIfSolutionExists(slug);
	}
};

/**
 * Adds a listener for the "NO_NEETCODE_SOLUTION" event.
 */
document.addEventListener("NO_NEETCODE_SOLUTION", (event: Event) => {
	const customEvent = event as CustomEvent<string>;
	console.log(`No NeetCode solution found for problem: ${customEvent.detail}`);
});

// Run the script
init();
