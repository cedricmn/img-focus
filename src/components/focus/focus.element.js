import { FocusElementLayout } from "./focus.element.layout";
import { Photo } from "../../model/photo";
import { PhotoStore } from "../../model/photo.store";
import focusStyles from "./focus.styles.less";
import focusTemplate from "./focus.template.html";

/**
 * Focus custom element
 */
export class FocusElement extends HTMLElement {

    constructor() {

        super();
        this.el = this.attachShadow({ "mode": "open" });
        this.store = new PhotoStore();

    }

    connectedCallback() {

        const focusStylesElement = document.createElement("style"),
            focusTemplateElement = document.createElement("template");

        focusStylesElement.textContent = focusStyles;
        focusTemplateElement.innerHTML = focusTemplate;

        this.el.appendChild(focusStylesElement);
        this.el.appendChild(focusTemplateElement);
        this.el.appendChild(focusTemplateElement.content.cloneNode(true));

        this.setup();

    }

    setup() {

        this.focusElement = this.el.querySelector("#focus");
        this.zoomElement = this.el.querySelector("#zoom");
        this.layout = new FocusElementLayout(this);

        this.addPhotos();
        this.addPhotoEventListener();
        this.addResizeHandler();

    }

    addPhotos() {

        const slotElement = this.shadowRoot.querySelector("#slot");

        slotElement.addEventListener("slotchange", () => {

            const elements = slotElement.assignedElements();
            let previousElement = null;
            elements.forEach((element) => {

                if (element.tagName === "IMG-PHOTO" && !this.store.get(element)) {

                    this.insertPhoto(element, previousElement);

                }

                previousElement = element;

            });

        });

    }

    insertPhoto(imgPhotoElement, previousImgPhotoElement) {

        const div = document.createElement("div"),
            img = document.createElement("img"),
            photo = new Photo(imgPhotoElement, div, img);

        img.srcset = imgPhotoElement.srcset;
        img.sizes = "(min-width: 320px) 640px";
        img.addEventListener("click", () => this.selectPhoto(photo));
        img.addEventListener("load", () => this.layout.layout());
        div.appendChild(img);

        this.insertPhotoAfter(photo, previousImgPhotoElement);

    }

    insertPhotoAfter(photo, previousImgPhotoElement) {

        if (previousImgPhotoElement === null) {

            this.focusElement.appendChild(photo.div);
            this.store.add(photo);

        } else {

            const previousPhoto = this.store.get(previousImgPhotoElement);
            previousPhoto.div.parentNode.insertBefore(photo.div, previousPhoto.div.nextSibling);
            this.store.insert(photo, previousPhoto);

        }

    }

    addResizeHandler() {

        let previousWidth = -1;
        new ResizeObserver(() => {

            const currentWidth = this.focusElement.getBoundingClientRect().width;

            /*
             * Layout only for width update as height will be updated after layout
             * and will trigger useless new layout.
             */
            if (currentWidth !== previousWidth) {

                this.layout.layout();
                previousWidth = currentWidth;

            }

        }).observe(this.focusElement);

    }

    addPhotoEventListener() {

        this.zoomElement.shadowRoot.addEventListener("imgphotoclose", () => this.hidePhoto());
        this.zoomElement.shadowRoot.addEventListener("imgphotoprev", () => this.prevPhoto());
        this.zoomElement.shadowRoot.addEventListener("imgphotonext", () => this.nextPhoto());

    }

    selectPhoto(photo) {

        this.store.select(photo);
        this.displayPhoto(photo);

    }

    prevPhoto() {

        const photo = this.store.prev();
        if (photo) {

            this.displayPhoto(photo);

        }

    }

    nextPhoto() {

        const photo = this.store.next();
        if (photo) {

            this.displayPhoto(photo);

        }

    }

    displayPhoto(photo) {

        let currentPhoto = this.zoomElement.querySelector("#currentphoto");
        if (!currentPhoto) {

            currentPhoto = document.createElement("img");
            currentPhoto.id = "currentphoto";
            this.zoomElement.appendChild(currentPhoto);

        }

        currentPhoto.srcset = photo.imgPhoto.srcset;
        currentPhoto.size = "100vw";
        this.zoomElement.style.display = "block";

    }

    hidePhoto() {

        this.zoomElement.style.display = "none";
        this.zoomElement.removeChild(this.zoomElement.querySelector("#currentphoto"));

    }

    /**
     * Get store attached to focus element
     */
    getStore() {

        return this.store;

    }

    /**
     * Get focus element
     */
    getFocusElement() {

        return this.focusElement;

    }

    /**
     * Get focus element bounding
     */
    getFocusElementBounding() {

        return this.focusElement.getBoundingClientRect();

    }

}
