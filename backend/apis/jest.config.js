module.exports = {
  bail: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverageFrom: ['apis/*.ts', 'apis/**/*.ts', '!apis/**/handler.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'mocks',
    '<rootDir>/declarations',
    'enums',
    'entities',
    'js-helpers',
  ],
  verbose: true,
  roots: ['<rootDir>/apis'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  reporters: ['default', ['jest-junit', { outputDirectory: 'test-results' }]],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
