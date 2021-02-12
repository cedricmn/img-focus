import "../src/index";

export class UtilTest {
  /**
   * Initialize focus element
   *
   * @param {*} document document
   * @param  {...any} childs focus element childs
   */
  static async initFocus(document, ...childs) {
    await window.customElements.whenDefined("img-focus");

    const imgFocus = document.createElement("img-focus");
    if (childs) {
      childs.forEach((child) => imgFocus.appendChild(child));
    }
    document.body.appendChild(imgFocus);

    const imgZoom = imgFocus.shadowRoot.querySelector("img-zoom");

    return {
      focusSlot: imgFocus.shadowRoot.querySelector("#focus"),
      imgFocus,
      zoomClose: imgZoom.shadowRoot.querySelector("#close"),
      zoomNext: imgZoom.shadowRoot.querySelector("#next"),
      zoomPrev: imgZoom.shadowRoot.querySelector("#prev"),
      zoomSlot: imgZoom.shadowRoot.querySelector("#slot"),
    };
  }

  /**
   * Initialize photo element
   *
   * @param {*} document document
   * @param {Object} options initialization options
   * @param {*} options.append append to document
   * @param {*} options.height intrinsic photo height
   * @param {*} options.srcset srcset
   * @param {*} options.sizes sizes
   * @param {*} options.width intrinsic photo width
   * @param {*} options.alt alternative text
   * @param  {...any} childs photo element childs
   */
  static async initPhoto(document, { append, height, srcset, sizes, width, alt } = { append: false }, ...childs) {
    await window.customElements.whenDefined("img-photo");

    const imgPhoto = document.createElement("img-photo");
    if (height) {
      imgPhoto.height = height;
    }
    if (srcset) {
      imgPhoto.srcset = srcset;
    }
    if (sizes) {
      imgPhoto.sizes = sizes;
    }
    if (width) {
      imgPhoto.width = width;
    }
    if (alt) {
      imgPhoto.alt = alt;
    }
    if (childs) {
      childs.forEach((child) => imgPhoto.appendChild(child));
    }
    if (append) {
      document.body.appendChild(imgPhoto);
    }

    return {
      imgPhoto,
      photoSlot: imgPhoto.shadowRoot.querySelector("#slot"),
    };
  }

  /**
   * Initialize zoom element
   *
   * @param {*} document document
   * @param {Object} options initialization options
   * @param {*} options.append append to document
   * @param {*} options.hasPrevious has previous picture
   * @param {*} options.hasNext has next picture
   * @param  {...any} childs zoom element childs
   */
  static async initZoom(document, { append, hasPrevious, hasNext } = { append: false }, ...childs) {
    await window.customElements.whenDefined("img-zoom");

    const imgZoom = document.createElement("img-zoom");
    if (hasPrevious) {
      imgZoom.hasprevious = "";
    }
    if (hasNext) {
      imgZoom.hasnext = "";
    }
    if (childs) {
      childs.forEach((child) => imgZoom.appendChild(child));
    }
    if (append) {
      document.body.appendChild(imgZoom);
    }

    const zoomClose = imgZoom.shadowRoot.querySelector("#close"),
      zoomNext = imgZoom.shadowRoot.querySelector("#next"),
      zoomPrev = imgZoom.shadowRoot.querySelector("#prev");

    // Need tabIndex for JSDOM to update activeElement while focusing an element
    zoomClose.tabIndex = 0;
    zoomNext.tabIndex = 0;
    zoomPrev.tabIndex = 0;

    return {
      imgZoom,
      zoomClose,
      zoomNext,
      zoomPrev,
      zoomSlot: imgZoom.shadowRoot.querySelector("#slot"),
    };
  }
}
