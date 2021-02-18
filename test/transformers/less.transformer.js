/* global module */

/**
 * @file LESS test transformer.
 */

/**
 * Mock LESS source to empty string.
 *
 * @returns {string} Empty string.
 */
const transformer = () => `module.exports = ${JSON.stringify("")}`;

module.exports = {
  process: transformer,
};
