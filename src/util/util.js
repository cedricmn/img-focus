/**
 * @file Util class.
 */

/**
 * Util class.
 */
export class Util {
  /**
   * Copy html attribute from source to target element.
   *
   * @param {HTMLElement} elementSource - Source element.
   * @param {HTMLElement} elementTarget - Target element.
   * @param {string} attributeName - Attribute name.
   */
  static copyAttribute(elementSource, elementTarget, attributeName) {
    if (elementSource && elementTarget) {
      if (elementSource.hasAttribute(attributeName)) {
        elementTarget.setAttribute(attributeName, elementSource.getAttribute(attributeName));
      } else {
        elementTarget.removeAttribute(attributeName);
      }
    }
  }

  /**
   * Set html attribute to element.
   *
   * @param {HTMLElement} element - Element.
   * @param {string} attributeName - Attribute name.
   * @param {*} value - Attribute value.
   */
  static setAttribute(element, attributeName, value) {
    if (value) {
      element.setAttribute(attributeName, value);
    } else {
      element.removeAttribute(attributeName);
    }
  }

  /**
   * Set boolean html attribute to element.
   *
   * @param {HTMLElement} element - Element.
   * @param {string} attributeName - Attribute name.
   * @param {boolean} value - Attribute boolean value.
   */
  static setBooleanAttribute(element, attributeName, value) {
    if (value) {
      element.setAttribute(attributeName, "");
    } else {
      element.removeAttribute(attributeName);
    }
  }
}
