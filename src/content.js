/**
 * Initializes the script, extracts slug, and appends the button.
 */
function init() {
	if (!document.querySelector("#neetcode-button")) {
		const slug = extractSlugFromURL();
		if (slug) {
			appendButtonIfSolutionExists(slug);
		}
	}
}

/**
 * Extracts the problem slug from the current LeetCode URL.
 * @returns {string|null} - The problem slug or null if invalid.
 */
function extractSlugFromURL() {
	const pathSegments = window.location.pathname.split("/");
	return pathSegments[2] || null;
}

/**
 * Appends the NeetCode button if a solution exists.
 * @param {string} slug - The problem slug from LeetCode.
 */
function appendButtonIfSolutionExists(slug) {
	chrome.runtime.sendMessage({ type: "CHECK_NEETCODE", slug }, (response) => {
		if (response?.exists) {
			const button = createButton(slug);
			document.body.appendChild(button);
		} else {
			dispatchNoSolutionEvent(slug);
		}
	});
}

/**
 * Dispatches an event when no solution exists.
 * @param {string} slug - The problem slug.
 */
function dispatchNoSolutionEvent(slug) {
	const event = new CustomEvent("NO_NEETCODE_SOLUTION", { detail: slug });
	document.dispatchEvent(event);
}

/**
 * Creates a draggable NeetCode solution button.
 * @param {string} slug - The problem slug from LeetCode.
 * @returns {HTMLElement} - The created button element.
 */
function createButton(slug) {
	const button = document.createElement("button");
	button.id = "neetcode-button";
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
		gap: 8px;
		background: #2c2c2c;
		color: white;
		border: none;
		border-radius: 5px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		cursor: grab;
		transition: transform 0.2s, box-shadow 0.2s;
	`;

	// Add hover effects
	button.addEventListener("mouseover", () => enhanceButtonHover(button));
	button.addEventListener("mouseout", () => resetButtonHover(button));

	// Add logo and text
	const logo = createLogoElement();
	const text = createTextElement("View NeetCode Solution");
	button.append(logo, text);

	// Add drag functionality
	addDragFunctionality(button);

	// Add click event to open NeetCode solution
	button.addEventListener("click", (e) => handleButtonClick(e, slug));

	return button;
}

/** Adds hover effects to the button */
function enhanceButtonHover(button) {
	button.style.transform = "scale(1.05)";
	button.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
}

/** Resets hover effects on the button */
function resetButtonHover(button) {
	button.style.transform = "scale(1)";
	button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
}

/** Creates the logo element for the button */
function createLogoElement() {
	const logo = document.createElement("img");
	logo.src = chrome.runtime.getURL("icons/logo-128.png");
	logo.alt = "NeetCode Logo";
	logo.style.cssText = `
		height: 24px;
		width: 24px;
		object-fit: contain;
		border-radius: 50%;
	`;
	return logo;
}

/** Creates the text element for the button */
function createTextElement(textContent) {
	const text = document.createElement("span");
	text.textContent = textContent;
	return text;
}

/** Adds drag functionality to the button */
function addDragFunctionality(button) {
	let isDragging = false;
	let offsetX, offsetY;

	const startDrag = (e) => {
		isDragging = true;
		button.style.cursor = "grabbing";
		offsetX = e.clientX - button.getBoundingClientRect().left;
		offsetY = e.clientY - button.getBoundingClientRect().top;
	};

	const onDrag = (e) => {
		if (isDragging) {
			button.style.top = `${e.clientY - offsetY}px`;
			button.style.left = `${e.clientX - offsetX}px`;
			button.style.right = "auto";
		}
	};

	const endDrag = () => {
		isDragging = false;
		button.style.cursor = "grab";
	};

	button.addEventListener("mousedown", startDrag);
	document.addEventListener("mousemove", onDrag);
	document.addEventListener("mouseup", endDrag);
}

/** Handles button click events */
function handleButtonClick(e, slug) {
	const isDragged = e.target.style.cursor === "grabbing";
	if (!isDragged) {
		const neetCodeUrl = `https://neetcode.io/solutions/${slug}`;
		window.open(neetCodeUrl, "_blank");
	} else {
		e.preventDefault();
	}
}

// Add event listener for no solution scenario
document.addEventListener("NO_NEETCODE_SOLUTION", (event) => {
	console.log(`No NeetCode solution found for problem: ${event.detail}`);
});

// Run the script
init();
