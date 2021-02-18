/* global module */
/**
 * @file HTML test transformer.
 */

/**
 * Transform HTML source to string.
 *
 * @param {*} src - HTML source.
 * @returns {string} HTML source as string.
 */
const transformer = (src) => `module.exports =  ${JSON.stringify(src)}`;

module.exports = {
  process: transformer,
};
