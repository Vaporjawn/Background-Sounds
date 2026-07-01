module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/styleMock.ts',
  },
  // Real coverage as of this commit is ~98%. These thresholds are set well
  // below that intentionally (per the repo health plan) as a conservative
  // first floor to enforce in CI - ratchet them up over time rather than
  // pinning them to today's exact numbers.
  coverageThreshold: {
    global: {
      statements: 70,
      lines: 70,
      functions: 70,
      branches: 60,
    },
  },
};