/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    clearMocks: true,

    collectCoverageFrom: ["<rootDir>/src/app/**/*.ts"],

    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],

    preset: "ts-jest",

    testEnvironment: "node",

    transform: {
        ".+\\.ts$": "ts-jest",
    },

    testTimeout: 30000,

    roots: ["<rootDir>/tests"],
};
