/* global global */

class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    element.addEventListener("resize-mock", () => this.callback());
  }
}

global.ResizeObserver = ResizeObserver;
