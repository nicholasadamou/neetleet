const puppeteer = require('puppeteer');
const { waitForButton, clickButton } = require('./helpers');

describe('LeetCode NeetCode Chrome Extension Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Add these flags for container environments
      dumpio: true, // Dumps browser process output to console
    });
    page = await browser.newPage();
    await page.goto("https://leetcode.com/problems/two-sum/");
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Injects button when solution exists', async () => {
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.src = '../../src/content.js';
      document.body.appendChild(script);
    });

    const buttonText = await waitForButton(page);
    expect(buttonText).toBe('🚀 View NeetCode Solution');
  });

  test('Button redirects to correct URL', async () => {
    await clickButton(page);

    const pages = await browser.pages();
    const newPage = pages[pages.length - 1]; // Get the newly opened tab
    expect(newPage.url()).toBe('https://neetcode.io/solutions/two-sum');
  });
});
