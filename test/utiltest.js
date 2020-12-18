import "../src/index";

export class UtilTest {

    /**
     * Initialize focus element
     *
     * @param {*} document document
     * @param  {...any} childs focus element childs
     */
    static async initFocus(document, ...childs) {

        const imgFocus = document.createElement("img-focus");
        if (childs) {

            childs.forEach(child => imgFocus.appendChild(child));

        }

        document.body.appendChild(imgFocus);

        await window.customElements.whenDefined("img-focus");

        const imgZoom = imgFocus.shadowRoot.querySelector("img-zoom");

        return {
            imgFocus: imgFocus,
            focusSlot: imgFocus.shadowRoot.querySelector("#focus"),
            zoomSlot: imgZoom.shadowRoot.querySelector("#slot"),
            zoomPrev: imgZoom.shadowRoot.querySelector("#prev"),
            zoomNext: imgZoom.shadowRoot.querySelector("#next"),
            zoomClose: imgZoom.shadowRoot.querySelector("#close"),
        };

    }

    /**
     * Initialize photo element
     *
     * @param {*} document document
     * @param {*} srcset srcset
     */
    static initPhoto(document, srcset) {

        const imgPhoto = document.createElement("img-photo");
        imgPhoto.srcset = srcset;
        return imgPhoto;

    }

    /**
     * Initialize zoom element
     *
     * @param {*} document document
     * @param  {...any} childs focus element childs
     */
    static async initZoom(document, ...childs) {

        const imgZoom = document.createElement("img-zoom");
        if (childs) {

            childs.forEach(child => imgZoom.appendChild(child));

        }

        document.body.appendChild(imgZoom);
        await window.customElements.whenDefined("img-zoom");

        return {
            zoomSlot: imgZoom.shadowRoot.querySelector("#slot"),
            zoomPrev: imgZoom.shadowRoot.querySelector("#prev"),
            zoomNext: imgZoom.shadowRoot.querySelector("#next"),
            zoomClose: imgZoom.shadowRoot.querySelector("#close"),
        };

    }

}