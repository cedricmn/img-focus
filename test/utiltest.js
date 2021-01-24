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
   * @param {*} srcset srcset
   * @param  {...any} childs photo element childs
   */
  static async initPhoto(document, srcset, ...childs) {
    await window.customElements.whenDefined("img-photo");

    const imgPhoto = document.createElement("img-photo");
    if (srcset) {
      imgPhoto.srcset = srcset;
    }
    if (childs) {
      childs.forEach((child) => imgPhoto.appendChild(child));
    }
    document.body.appendChild(imgPhoto);

    return {
      imgPhoto,
      photoSlot: imgPhoto.shadowRoot.querySelector("#slot"),
    };
  }

  /**
   * Initialize zoom element
   *
   * @param {*} document document
   * @param {Object} data attributes default values
   * @param {*} data.hasPrevious has previous picture
   * @param {*} data.hasNext has next picture
   * @param  {...any} childs zoom element childs
   */
  static async initZoom(document, { hasPrevious, hasNext } = {}, ...childs) {
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
    document.body.appendChild(imgZoom);

    return {
      imgZoom,
      zoomClose: imgZoom.shadowRoot.querySelector("#close"),
      zoomNext: imgZoom.shadowRoot.querySelector("#next"),
      zoomPrev: imgZoom.shadowRoot.querySelector("#prev"),
      zoomSlot: imgZoom.shadowRoot.querySelector("#slot"),
    };
  }
}
