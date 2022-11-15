/**
 * @file HTML test transformer.
 */

/**
 * Transform HTML source to string.
 *
 * @param {*} src - HTML source.
 * @returns {string} HTML source as string.
 */
const transformer = (src) => ({ code: `module.exports = ${JSON.stringify(src)}` });

export default {
  process: transformer,
};
