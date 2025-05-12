// mocks/fs.js
// This is a minimal mock of the fs module for browser environments
const fs = {
  lstat: () => Promise.resolve({}),
  stat: () => Promise.resolve({}),
  readdir: () => Promise.resolve([]),
  // Add any other needed fs methods here
};

module.exports = fs;
