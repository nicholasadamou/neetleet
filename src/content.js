/**
 * Creates a NeetCode solution button.
 * @param {string} slug - The problem slug from LeetCode.
 * @returns {HTMLElement} - The created button element.
 */
function createButton(slug) {
  const button = document.createElement("button");
  button.id = "neetcode-button";
  button.innerHTML = "🚀 View NeetCode Solution"; // Add the rocket emoji
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #2c2c2c;
    color: white;
    border: none;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  `;

  // Add hover effect
  button.addEventListener("mouseover", () => {
    button.style.transform = "scale(1.05)";
    button.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
  });

  button.addEventListener("mouseout", () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  });

  // Add click event to open NeetCode solution
  button.addEventListener("click", () => {
    const neetCodeUrl = `https://neetcode.io/solutions/${slug}`;
    window.open(neetCodeUrl, "_blank");
  });

  return button;
}

/**
 * Appends the NeetCode button to the DOM if a solution exists.
 * @param {string} slug - The problem slug from LeetCode.
 */
function appendButtonIfSolutionExists(slug) {
  // Send a message to the background script to check if the solution exists
  chrome.runtime.sendMessage({ type: "CHECK_NEETCODE", slug }, (response) => {
    if (response && response.exists) {
      // Create and append the button
      const button = createButton(slug);
      document.body.appendChild(button);
    } else {
      console.warn("No NeetCode solution found for this problem.");
    }
  });
}

/**
 * Initializes the content script.
 * Extracts the problem slug and appends the button if it doesn't exist.
 */
function init() {
  if (!document.querySelector("#neetcode-button")) {
    // Extract the problem slug from the LeetCode URL
    const problemSlug = window.location.pathname.split("/")[2];
    appendButtonIfSolutionExists(problemSlug);
  }
}

// Run the content script
init();

// Export functions for testing
module.exports = {
  createButton,
  appendButtonIfSolutionExists,
  init,
};
