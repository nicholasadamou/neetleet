module.exports = {
    waitForButton: async (page, selector = '#neetcode-button') => {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (el) => el.textContent);
    },
  
    clickButton: async (page, selector = '#neetcode-button') => {
      const button = await page.$(selector);
      if (button) {
        await button.click();
      } else {
        throw new Error('Button not found');
      }
    },
  };
  