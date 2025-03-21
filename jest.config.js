/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  verbose: true,
  testPathIgnorePatterns: ["/node_modules", "/dist/"],
  testTimeout: 20000,
};
