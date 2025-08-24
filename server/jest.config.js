
module.exports = {
  // Use the Node.js environment for testing
  testEnvironment: 'node',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // A path to a module that runs some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./test/setup'],
  // The test timeout in milliseconds
  testTimeout: 10000,
};