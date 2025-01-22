import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass|svg)$': '<rootDir>/src/test/empty-module.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/main.tsx',
    '!src/env.d.ts',
    '!src/**/__mocks__/**',
    '!src/test/**',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
};

export default config;
