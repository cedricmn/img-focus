import { FocusElementLayout } from "./focus.element.layout";
import { Photo } from "../../model/photo";
import { PhotoStore } from "../../model/photo.store";
import { Util } from "../../util/util";
import focusStyles from "./focus.styles.less";
import focusTemplate from "./focus.template.html";

/**
 * Focus custom element
 */
export class FocusElement extends HTMLElement {
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
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
    const slotElement = this.shadowRoot.querySelector("#focus");

    slotElement.addEventListener("slotchange", () => {
      const elements = slotElement.assignedElements();
      let previousElement = null;
      elements.forEach((element) => {
        if (element.tagName === "IMG-PHOTO" && !this.store.get(element)) {
          this.addPhoto(element, previousElement);
        }

        previousElement = element;
      });
    });
  }

  addPhoto(imgPhotoElement, previousImgPhotoElement) {
    const photo = new Photo(imgPhotoElement);

    imgPhotoElement.addEventListener("img-photo-select", () => this.openPhoto(photo));
    imgPhotoElement.addEventListener("img-photo-load", () => this.layout.layout());

    this.insertPhoto(photo, previousImgPhotoElement);
  }

  insertPhoto(photo, previousImgPhotoElement) {
    if (previousImgPhotoElement === null) {
      this.store.add(photo);
    } else {
      const previousPhoto = this.store.get(previousImgPhotoElement);
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
    this.zoomElement.addEventListener("img-zoom-close", () => this.closePhoto());
    this.zoomElement.addEventListener("img-zoom-prev", () => this.prevPhoto());
    this.zoomElement.addEventListener("img-zoom-next", () => this.nextPhoto());
  }

  openPhoto(photo) {
    this.el.dispatchEvent(new Event("img-focus-photo-open", { bubbles: true, composed: true }));

    this.store.select(photo);
    this.displayPhoto(photo);
    this.zoomElement.style.display = "block";
    this.zoomElement.focus({ preventScroll: true });
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
    const figcaption = this.zoomElement.querySelector("#zoom-figcaption"),
      image = this.zoomElement.querySelector("#zoom-image");

    Util.setBooleanAttribute(this.zoomElement, "hasprevious", this.store.hasPrev(photo));
    Util.setBooleanAttribute(this.zoomElement, "hasnext", this.store.hasNext(photo));
    Util.copyAttribute(photo.imgPhoto, image, "alt");
    Util.copyAttribute(photo.imgPhoto, image, "srcset");
    Util.setAttribute(image, "size", "100vw");

    figcaption.textContent = photo.imgPhoto.alt;
  }

  closePhoto() {
    this.el.dispatchEvent(new Event("img-focus-photo-close", { bubbles: true, composed: true }));

    const figcaption = this.zoomElement.querySelector("#zoom-figcaption"),
      image = this.zoomElement.querySelector("#zoom-image");

    this.zoomElement.style.display = "none";
    image.alt = "";
    image.srcset = "";
    image.size = "";
    figcaption.textContent = "";

    // Focus last openned photo
    this.store.getCurrent().imgPhoto.focus();
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
