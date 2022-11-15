/**
 * @file LESS test transformer.
 */

/**
 * Mock LESS source to empty string.
 *
 * @returns {string} Empty string.
 */
const transformer = () => ({ code: "" });

export default {
  process: transformer,
};
