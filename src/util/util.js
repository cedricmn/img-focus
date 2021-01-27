/**
 * Util class
 */
export class Util {
  /**
   * Copy html attribute from source to target element
   * @param {*} elementSource source element
   * @param {*} elementTarget target element
   * @param {*} attributeName attribute name
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
   * Set html attribute to element
   * @param {*} element element
   * @param {*} attributeName attribute name
   * @param {*} value attribute value
   */
  static setAttribute(element, attributeName, value) {
    if (value) {
      element.setAttribute(attributeName, value);
    } else {
      element.removeAttribute(attributeName);
    }
  }

  /**
   * Set boolean html attribute to element
   * @param {*} element element
   * @param {*} attributeName attribute name
   * @param {*} value attribute boolean value
   */
  static setBooleanAttribute(element, attributeName, value) {
    if (value) {
      element.setAttribute(attributeName, "");
    } else {
      element.removeAttribute(attributeName);
    }
  }
}
