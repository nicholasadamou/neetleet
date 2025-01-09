const chrome = {
  runtime: {
    sendMessage: jest.fn((message, callback) => {
      if (message.type === "CHECK_NEETCODE" && message.slug === "two-sum") {
        callback({ exists: true });
      } else {
        callback({ exists: false });
      }
    }),
  },
};

global.chrome = chrome; // Attach chrome mock globally
global.fetch = jest.fn(); // Mock global fetch

module.exports = chrome;
