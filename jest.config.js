const { defaults } = require('jest-config');

module.exports = {
    "verbose": true,
    "projects": [
        {
            "displayName": "test",
            "roots": [
                "<rootDir>/src/"
            ],
            "coveragePathIgnorePatterns": [
                "<rootDir>/test/",
                "<rootDir>/node_modules/"
            ],
            "moduleFileExtensions": [
                ...defaults.moduleFileExtensions,
                "html",
                "less"
            ],
            "transform": {
                "^.+\\.[t|j]sx?$": "babel-jest",
                "^.+\\.html$": "<rootDir>/test/transformers/html.transformer.js",
                "^.+\\.less$": "<rootDir>/test/transformers/less.transformer.js"
            },
            "setupFiles": [
                "<rootDir>/test/setup.js"
            ]
        },
        {
            "displayName": "lint",
            "runner": "jest-runner-eslint",
        }
    ]
};