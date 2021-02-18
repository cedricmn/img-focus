/**
 * @file Test util class.
 */
import "../src/index";

/**
 * Test util class.
 */
export class UtilTest {
  /**
   * Initialize focus element.
   *
   * @param {*} document - Document.
   * @param {...any} childs - Focus element childs.
   * @returns {*} Focus elements.
   */
  static async initFocus(document, ...childs) {
    await window.customElements.whenDefined("img-focus");

    const focusElement = document.createElement("img-focus");
    if (childs) {
      childs.forEach((child) => focusElement.appendChild(child));
    }
    document.body.appendChild(focusElement);

    const zoomElement = focusElement.shadowRoot.querySelector("img-zoom");

    return {
      focusElement,
      focusSlot: focusElement.shadowRoot.querySelector("#focus"),
      zoomClose: zoomElement.shadowRoot.querySelector("#close"),
      zoomNext: zoomElement.shadowRoot.querySelector("#next"),
      zoomPrev: zoomElement.shadowRoot.querySelector("#prev"),
      zoomSlot: zoomElement.shadowRoot.querySelector("#slot"),
    };
  }

  /**
   * Initialize photo element.
   *
   * @param {*} document - Document.
   * @param {object} options - Initialization options.
   * @param {*} options.append - Append to document.
   * @param {*} options.height - Intrinsic photo height.
   * @param {*} options.srcset - Photo sources.
   * @param {*} options.sizes - Photos sizes.
   * @param {*} options.width - Intrinsic photo width.
   * @param {*} options.alt - Alternative text.
   * @param {...any} childs - Photo element childs.
   * @returns {*} Photo elements.
   */
  static async initPhoto(document, { append, height, srcset, sizes, width, alt } = { append: false }, ...childs) {
    await window.customElements.whenDefined("img-photo");

    const photoElement = document.createElement("img-photo");
    if (height) {
      photoElement.height = height;
    }
    if (srcset) {
      photoElement.srcset = srcset;
    }
    if (sizes) {
      photoElement.sizes = sizes;
    }
    if (width) {
      photoElement.width = width;
    }
    if (alt) {
      photoElement.alt = alt;
    }
    if (childs) {
      childs.forEach((child) => photoElement.appendChild(child));
    }
    if (append) {
      document.body.appendChild(photoElement);
    }

    return {
      photoElement,
      photoSlot: photoElement.shadowRoot.querySelector("#slot"),
    };
  }

  /**
   * Initialize zoom element.
   *
   * @param {*} document - Document.
   * @param {object} options - Initialization options.
   * @param {*} options.append - Append to document.
   * @param {*} options.hasPrevious - Has previous picture.
   * @param {*} options.hasNext - Has next picture.
   * @param {...any} childs - Zoom element childs.
   * @returns {*} Zoom elements.
   */
  static async initZoom(document, { append, hasPrevious, hasNext } = { append: false }, ...childs) {
    await window.customElements.whenDefined("img-zoom");

    const zoomElement = document.createElement("img-zoom");
    if (hasPrevious) {
      zoomElement.hasprevious = "";
    }
    if (hasNext) {
      zoomElement.hasnext = "";
    }
    if (childs) {
      childs.forEach((child) => zoomElement.appendChild(child));
    }
    if (append) {
      document.body.appendChild(zoomElement);
    }

    const zoomClose = zoomElement.shadowRoot.querySelector("#close"),
      zoomNext = zoomElement.shadowRoot.querySelector("#next"),
      zoomPrev = zoomElement.shadowRoot.querySelector("#prev");

    // Need tabIndex for JSDOM to update activeElement while focusing an element
    zoomClose.tabIndex = 0;
    zoomNext.tabIndex = 0;
    zoomPrev.tabIndex = 0;

    return {
      zoomClose,
      zoomElement,
      zoomNext,
      zoomPrev,
      zoomSlot: zoomElement.shadowRoot.querySelector("#slot"),
    };
  }
}
