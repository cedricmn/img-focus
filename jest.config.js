export default {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"],
  projects: [
    {
      displayName: "test",
      roots: ["src/"],
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.html$": "<rootDir>/test/transformers/html.transformer.js",
        "^.+\\.less$": "<rootDir>/test/transformers/less.transformer.js",
      },
      setupFiles: ["<rootDir>/test/setup.js"],
    },
    {
      displayName: "lint",
      runner: "jest-runner-eslint",
    },
  ],
};
