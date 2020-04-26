module.exports = {
  preset: '@shelf/jest-mongodb',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  watchPathIgnorePatterns: ['<rootDir>/src/generated/'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false,
    },
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-suspend',
      {
        key: 's',
        prompt: 'suspend watch mode',
        'suspend-on-start': true,
      },
    ],
  ],
};
