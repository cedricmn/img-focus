/* global global */
/**
 * @file ResizeObserver mock.
 */

/**
 * ResizeObserver mock.
 */
class ResizeObserver {
  /**
   * Constructor.
   *
   * @param {*} callback - Callback to call on resize.
   */
  constructor(callback) {
    this.callback = callback;
  }

  /**
   * Observe element for resize.
   *
   * @param {HTMLElement} element - Element to observe.
   */
  observe(element) {
    element.addEventListener("resize-mock", () => this.callback());
  }
}

global.ResizeObserver = ResizeObserver;
