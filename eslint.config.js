import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.config.js", "dist/**/*"],
}, ...compat.extends("eslint:all"), {
    plugins: {
        jsdoc,
    },
    languageOptions: {
        globals: {
            ...globals.browser,
        },
        sourceType: "module",
    },
    rules: {
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-examples": "off",
        "jsdoc/check-indentation": "error",
        "jsdoc/check-line-alignment": "error",
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-syntax": "error",
        "jsdoc/check-tag-names": "error",
        "jsdoc/check-types": "error",
        "jsdoc/check-values": "error",
        "jsdoc/empty-tags": "error",
        "jsdoc/implements-on-classes": "error",
        "jsdoc/match-description": "error",
        "jsdoc/no-bad-blocks": "error",
        "jsdoc/no-defaults": "error",
        "jsdoc/no-types": "off",
        "jsdoc/no-undefined-types": "error",
        "jsdoc/require-description": "error",
        "jsdoc/require-description-complete-sentence": "error",
        "jsdoc/require-example": "off",
        "jsdoc/require-file-overview": "error",
        "jsdoc/require-hyphen-before-param-description": "error",
        "jsdoc/require-jsdoc": ["error", {
            require: {
                ArrowFunctionExpression: true,
                ClassDeclaration: true,
                ClassExpression: true,
                FunctionDeclaration: true,
                FunctionExpression: true,
                MethodDefinition: true,
            },

            checkConstructors: true,
            checkGetters: true,
            checkSetters: true,
        }],
        "jsdoc/require-param": "error",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-returns": "error",
        "jsdoc/require-returns-check": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns-type": "error",
        "jsdoc/require-throws": "error",
        "jsdoc/require-yields": "error",
        "jsdoc/require-yields-check": "error",
        "jsdoc/valid-types": "error",
        indent: ["error", 2, {
            SwitchCase: 1,
        }],
        "padded-blocks": ["error", "never"],
        "quote-props": ["error", "as-needed"],
        "no-extra-parens": ["error", "all", {
            nestedBinaryExpressions: false,
        }],
        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "never",
        }],
        "array-element-newline": ["error", "consistent"],
        "lines-around-comment": ["error", {
            allowClassStart: true,
        }],
        "dot-location": ["error", "property"],
        "function-call-argument-newline": ["error", "consistent"],
        "no-magic-numbers": ["error", {
            ignore: [-1, 0, 1],
        }],
        "object-curly-spacing": ["error", "always"],
        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "always",
        }],
        "max-len": ["error", 120],
        "object-property-newline": ["error", {
            allowAllPropertiesOnSameLine: true,
        }],
    },
}, ...compat.extends("plugin:jest/all", "plugin:jest-formatting/strict").map(config => ({
    ...config,
    files: ["**/*.test.js", "test/**"],
})), {
    files: ["**/*.test.js", "test/**/*"],
    rules: {
        "no-magic-numbers": "off",
        "max-lines-per-function": ["error", 150],
        "one-var": ["error", "consecutive"],
        "no-new": "off",
        "max-statements": ["error", 30],
        "jest/max-expects": ["error", {
            max: 15,
        }],
    },
}];