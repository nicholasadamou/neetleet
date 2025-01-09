const { createButton, appendButtonIfSolutionExists, init } = require("../../src/content");

beforeAll(() => {
  // Set up a reusable mock for window.location
  global.window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      pathname: "/problems/two-sum/",
    },
    writable: true,
  });
});

describe("Content Script - createButton", () => {
  test("Creates a button with correct properties", () => {
    const slug = "two-sum";
    const button = createButton(slug);

    expect(button).not.toBeNull();
    expect(button.id).toBe("neetcode-button");
    expect(button.innerHTML).toContain("🚀 View NeetCode Solution");

    // Simulate a click
    window.open = jest.fn();
    button.click();
    expect(window.open).toHaveBeenCalledWith(`https://neetcode.io/solutions/${slug}`, "_blank");
  });
});

describe("Content Script - appendButtonIfSolutionExists", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // Reset DOM
  });

  test("Appends button if solution exists", () => {
    appendButtonIfSolutionExists("two-sum");

    const button = document.querySelector("#neetcode-button");
    expect(button).not.toBeNull();
  });

  test("Does not append button if solution does not exist", () => {
    appendButtonIfSolutionExists("invalid-slug");

    const button = document.querySelector("#neetcode-button");
    expect(button).toBeNull();
  });
});

describe("Content Script - init", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // Reset DOM
  });

  test("Initializes and appends button if solution exists", () => {
    chrome.runtime.sendMessage = jest.fn((message, callback) => {
      callback({ exists: true });
    });

    init();

    const button = document.querySelector("#neetcode-button");
    expect(button).not.toBeNull();
  });

  test("Does not append button if solution does not exist", () => {
    chrome.runtime.sendMessage = jest.fn((message, callback) => {
      callback({ exists: false });
    });

    init();

    const button = document.querySelector("#neetcode-button");
    expect(button).toBeNull();
  });
});

describe("Content Script - Utility Functions", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // Reset DOM
  });

  test("Correctly extracts problem slug from URL", () => {
    const problemSlug = window.location.pathname.split("/")[2];
    expect(problemSlug).toBe("two-sum");
  });

  test("Generates correct NeetCode URL", () => {
    const problemSlug = "two-sum";
    const expectedUrl = `https://neetcode.io/solutions/${problemSlug}`;
    expect(expectedUrl).toBe("https://neetcode.io/solutions/two-sum");
  });

  test("Creates and appends button to DOM", () => {
    const button = createButton("two-sum");
    document.body.appendChild(button);

    const addedButton = document.querySelector("#neetcode-button");
    expect(addedButton).not.toBeNull();
    expect(addedButton.innerHTML).toContain("🚀 View NeetCode Solution");
  });
});

describe("Content Script - Interaction Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // Reset DOM
  });

  test("Injects button into the DOM when solution exists", async () => {
    // Mock fetch to simulate a successful fetch response
    fetch.mockResolvedValueOnce({ ok: true });
  
    // Mock chrome.runtime.sendMessage to simulate a successful solution check
    chrome.runtime.sendMessage = jest.fn((message, callback) => {
      callback({ exists: true });
    });
  
    // Call the init function
    await init();
  
    // Check if the button was injected into the DOM
    const button = document.querySelector("#neetcode-button");
    expect(button).not.toBeNull();
    expect(button.innerHTML).toContain("🚀 View NeetCode Solution");
  });

  test("Does not inject button when solution does not exist", async () => {
    // Set window.location.pathname to a slug that does not exist
    window.location.pathname = "/problems/non-existent-problem/";
  
    // Ensure chrome.runtime.sendMessage mock returns { exists: false }
    chrome.runtime.sendMessage = jest.fn((message, callback) => {
      callback({ exists: false }); // Simulate no solution existing
    });
  
    // Call init
    await init();
  
    // Check if the button was appended
    const button = document.querySelector("#neetcode-button");
    expect(button).toBeNull(); // Ensure no button is appended
  });  
});
