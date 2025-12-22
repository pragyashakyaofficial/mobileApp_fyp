module.exports = {
  maxWorkers: 1,
  testEnvironment: 'node',
  testTimeout: 120000,
  testRegex: '\\.test\\.js$',
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
};
