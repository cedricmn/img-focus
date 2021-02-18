/**
 * @file Focus element.
 */
import { FocusElementLayout } from "./focus.element.layout";
import { Photo } from "../../model/photo";
import { PhotoElement } from "../photo/photo.element";
import { PhotoStore } from "../../model/photo.store";
import { Util } from "../../util/util";
import focusStyles from "./focus.styles.less";
import focusTemplate from "./focus.template.html";

/**
 * Focus element.
 */
export class FocusElement extends HTMLElement {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
    this.store = new PhotoStore();
  }

  /**
   * Initialize element.
   */
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

  /**
   * Setup element.
   */
  setup() {
    this.focusSlot = this.el.querySelector("#focus");
    this.zoomElement = this.el.querySelector("#zoom");
    this.layout = new FocusElementLayout(this);

    this.addPhotos();
    this.addZoomEventListeners();
    this.addResizeObserver();
  }

  /**
   * Add photos.
   */
  addPhotos() {
    this.focusSlot.addEventListener("slotchange", () => {
      const elements = this.focusSlot.assignedElements();
      let previousElement = null;
      elements.forEach((element) => {
        if (element.tagName === "IMG-PHOTO" && !this.store.get(element)) {
          this.addPhoto(element, previousElement);
        }

        previousElement = element;
      });
    });
  }

  /**
   * Add sloted photo.
   *
   * @param {PhotoElement} photoElement - Photo element.
   * @param {PhotoElement} previousPhotoElement - Previous photo element to insert photo at the right place.
   */
  addPhoto(photoElement, previousPhotoElement) {
    const photo = new Photo(photoElement);
    this.insertPhoto(photo, previousPhotoElement);

    photoElement.addEventListener("img-photo-select", () => this.openPhoto(photo));
    if (!photoElement.hasAttribute("width") || !photoElement.hasAttribute("height")) {
      // Need to wait for photo to load before doing layout
      photoElement.addEventListener("img-photo-load", () => this.layout.layout());
    } else {
      // Direct layout
      this.layout.layout();
    }
  }

  /**
   * Insert photo in photo store.
   *
   * @param {Photo} photo - Photo.
   * @param {PhotoElement} previousPhotoElement - Previous photo element to insert photo at the right place.
   */
  insertPhoto(photo, previousPhotoElement) {
    if (previousPhotoElement === null) {
      this.store.add(photo);
    } else {
      const previousPhoto = this.store.get(previousPhotoElement);
      this.store.insert(photo, previousPhoto);
    }
  }

  /**
   * Add focus resize observer to layout in case of resize.
   */
  addResizeObserver() {
    let previousWidth = -1;
    new ResizeObserver(() => {
      const currentWidth = this.focusSlot.getBoundingClientRect().width;

      /*
       * Layout only for width update as height will be updated after layout
       * and will trigger useless new layout.
       */
      if (currentWidth !== previousWidth) {
        this.layout.layout();
        previousWidth = currentWidth;
      }
    }).observe(this.focusSlot);
  }

  /**
   * Add zoom event listeners.
   */
  addZoomEventListeners() {
    this.zoomElement.addEventListener("img-zoom-close", () => this.closePhoto());
    this.zoomElement.addEventListener("img-zoom-prev", () => this.prevPhoto());
    this.zoomElement.addEventListener("img-zoom-next", () => this.nextPhoto());
  }

  /**
   * Open photo.
   *
   * @param {Photo} photo - Photo to display.
   */
  openPhoto(photo) {
    this.el.dispatchEvent(new Event("img-focus-photo-open", { bubbles: true, composed: true }));

    this.store.select(photo);
    this.displayPhoto(photo);
    this.zoomElement.style.display = "block";
    this.zoomElement.focus({ preventScroll: true });
  }

  /**
   * Navigate to previous photo.
   */
  prevPhoto() {
    const photo = this.store.prev();
    if (photo) {
      this.displayPhoto(photo);
    }
  }

  /**
   * Navigate to next photo.
   */
  nextPhoto() {
    const photo = this.store.next();
    if (photo) {
      this.displayPhoto(photo);
    }
  }

  /**
   * Display photo.
   *
   * @param {Photo} photo - Photo to display.
   */
  displayPhoto(photo) {
    const figcaption = this.zoomElement.querySelector("#zoom-figcaption"),
      image = this.zoomElement.querySelector("#zoom-image");

    Util.setBooleanAttribute(this.zoomElement, "hasprevious", this.store.hasPrev(photo));
    Util.setBooleanAttribute(this.zoomElement, "hasnext", this.store.hasNext(photo));
    Util.copyAttribute(photo.photoElement, image, "alt");
    Util.copyAttribute(photo.photoElement, image, "srcset");
    Util.setAttribute(image, "sizes", "100vw");

    figcaption.textContent = photo.photoElement.alt;
  }

  /**
   * Close photo.
   */
  closePhoto() {
    this.el.dispatchEvent(new Event("img-focus-photo-close", { bubbles: true, composed: true }));

    const figcaption = this.zoomElement.querySelector("#zoom-figcaption"),
      image = this.zoomElement.querySelector("#zoom-image");

    this.zoomElement.style.display = "none";
    image.alt = "";
    image.srcset = "";
    image.sizes = "";
    figcaption.textContent = "";

    // Focus last openned photo
    this.store.getCurrent().photoElement.focus();
  }

  /**
   * Get photo store.
   *
   * @returns {PhotoStore} Photo store.
   */
  getStore() {
    return this.store;
  }

  /**
   * Get focus slot.
   *
   * @returns {HTMLElement} Focus slot.
   */
  getFocusSlot() {
    return this.focusSlot;
  }

  /**
   * Get focus slot bounding.
   *
   * @returns {DOMRect} Focus slot bounding.
   */
  getFocusSlotBounding() {
    return this.focusSlot.getBoundingClientRect();
  }
}
