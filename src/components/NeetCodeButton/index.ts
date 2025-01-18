/**
 * Creates a draggable NeetCode solution button.
 *
 * @param {string} slug - The slug representing the problem.
 * @returns {HTMLButtonElement} - The created button element with assigned properties and events.
 */
const createNeetCodeButton = (slug: string): HTMLButtonElement => {
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
	button.addEventListener("click", (e: MouseEvent) => handleButtonClick(e, slug));

	return button;
};

/**
 * Adds hover effects to the given button element.
 *
 * @param {HTMLElement} button - The button element to add hover effects to.
 */
const enhanceButtonHover = (button: HTMLElement): void => {
	button.style.transform = "scale(1.05)";
	button.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
};

/**
 * Resets the hover effects applied to a button element.
 *
 * @param {HTMLElement} button - The button element to reset hover effects on.
 */
const resetButtonHover = (button: HTMLElement): void => {
	button.style.transform = "scale(1)";
	button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
};

/**
 * Creates and returns the logo `<img>` element for the button.
 *
 * @returns {HTMLImageElement} - The logo element for the button.
 */
const createLogoElement = (): HTMLImageElement => {
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
};

/**
 * Creates and returns the text `<span>` element for the button.
 *
 * @param {string} textContent - The text to be displayed in the button.
 * @returns {HTMLSpanElement} - The text element for the button.
 */
const createTextElement = (textContent: string): HTMLSpanElement => {
	const text = document.createElement("span");
	text.textContent = textContent;
	return text;
};

/**
 * Adds drag-and-drop functionality to the given button element.
 *
 * @param {HTMLElement} button - The button element to enable drag-and-drop functionality.
 */
const addDragFunctionality = (button: HTMLElement): void => {
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;

	const startDrag = (e: MouseEvent): void => {
		isDragging = true;
		button.style.cursor = "grabbing";
		offsetX = e.clientX - button.getBoundingClientRect().left;
		offsetY = e.clientY - button.getBoundingClientRect().top;
	};

	const onDrag = (e: MouseEvent): void => {
		if (isDragging) {
			button.style.top = `${e.clientY - offsetY}px`;
			button.style.left = `${e.clientX - offsetX}px`;
			button.style.right = "auto";
		}
	};

	const endDrag = (): void => {
		isDragging = false;
		button.style.cursor = "grab";
	};

	button.addEventListener("mousedown", startDrag);
	document.addEventListener("mousemove", onDrag);
	document.addEventListener("mouseup", endDrag);
};

/**
 * Handles click events on the button element. Opens the NeetCode solution if not dragged.
 *
 * @param {MouseEvent} e - The mouse event triggered by clicking the button.
 * @param {string} slug - The slug for the problem being opened.
 */
const handleButtonClick = (e: MouseEvent, slug: string): void => {
	const isDragged = (e.target as HTMLElement).style.cursor === "grabbing";
	if (!isDragged) {
		const neetCodeUrl = `https://neetcode.io/solutions/${slug}`;
		window.open(neetCodeUrl, "_blank");
	} else {
		e.preventDefault();
	}
};

export { createNeetCodeButton };
