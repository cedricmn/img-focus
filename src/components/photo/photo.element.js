/**
 * @file Photo element.
 */
import { Util } from "../../util/util";
import photoStyles from "./photo.styles.less";
import photoTemplate from "./photo.template.html";

/**
 * Photo element.
 */
export class PhotoElement extends HTMLElement {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
  }

  /**
   * Photo observed attributes.
   *
   * @returns {string[]} Observed attributes.
   */
  static get observedAttributes() {
    return ["srcset", "sizes", "width", "height", "alt"];
  }

  /**
   * Update image attributes when photo element attributes are updated.
   */
  attributeChangedCallback() {
    this.updateAttributes();
  }

  /**
   * Initialiaze element.
   */
  connectedCallback() {
    const photoStylesElement = document.createElement("style"),
      photoTemplateElement = document.createElement("template");

    photoStylesElement.textContent = photoStyles;
    photoTemplateElement.innerHTML = photoTemplate;

    this.el.appendChild(photoStylesElement);
    this.el.appendChild(photoTemplateElement);
    this.el.appendChild(photoTemplateElement.content.cloneNode(true));

    this.tabIndex = 0;
    Util.setAttribute(this, "role", "button");
    Util.setAttribute(this, "aria-label", this.alt);

    this.setup();
  }

  /**
   * Setup element.
   */
  setup() {
    // Keyboard navigation
    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        this.dispatchEvent(new Event("img-photo-select"));
        event.preventDefault();
      }
    });
    this.addEventListener("click", () => this.dispatchEvent(new Event("img-photo-select")));

    this.img = document.createElement("img");
    Util.setAttribute(this.img, "role", "none");
    this.img.addEventListener("load", () => this.dispatchEvent(new Event("img-photo-load")));
    this.updateAttributes();

    this.el.appendChild(this.img);
  }

  /**
   * Update image attributes.
   */
  updateAttributes() {
    if (this.img) {
      Util.copyAttribute(this, this.img, "srcset");
      Util.copyAttribute(this, this.img, "alt");
      if (this.hasAttribute("sizes")) {
        Util.copyAttribute(this, this.img, "sizes");
      } else {
        Util.setAttribute(this.img, "sizes", "(min-width: 50em) 15vw, 100vw");
      }
      Util.copyAttribute(this, this.img, "width");
      Util.copyAttribute(this, this.img, "height");
    }
  }

  /**
   * Clear image layout data.
   */
  clearSize() {
    this.img.style.width = "";
    this.img.style.height = "";
  }

  /**
   * Set image width.
   *
   * @param {number} width - Image width.
   */
  setWidth(width) {
    this.img.style.width = width;
  }

  /**
   * Set image height.
   *
   * @param {number} height - Image height.
   */
  setHeight(height) {
    this.img.style.height = height;
  }

  /**
   * Get image.
   *
   * @returns {HTMLElement} Image.
   */
  getImg() {
    return this.img;
  }

  /**
   * Get "srcset" attribute value.
   *
   * @returns {string} "srcset" attribute value.
   */
  get srcset() {
    return this.getAttribute("srcset");
  }

  /**
   * Set "srcset" attribute.
   */
  set srcset(srcset) {
    this.setAttribute("srcset", srcset);
  }

  /**
   * Get "sizes" attribute value.
   *
   * @returns {string} "sizes" attribute value.
   */
  get sizes() {
    return this.getAttribute("sizes");
  }

  /**
   * Set "sizes" attribute.
   */
  set sizes(sizes) {
    this.setAttribute("sizes", sizes);
  }

  /**
   * Get "width" attribute value.
   *
   * @returns {string} "width" attribute value.
   */
  get width() {
    return this.getAttribute("width");
  }

  /**
   * Set "width" attribute.
   */
  set width(width) {
    this.setAttribute("width", width);
  }

  /**
   * Get "height" attribute value.
   *
   * @returns {string} "height" attribute value.
   */
  get height() {
    return this.getAttribute("height");
  }

  /**
   * Set "height" attribute.
   */
  set height(height) {
    this.setAttribute("height", height);
  }

  /**
   * Get "alt" attribute value.
   *
   * @returns {string} "alt" attribute value.
   */
  get alt() {
    return this.getAttribute("alt");
  }

  /**
   * Set "alt" attribute.
   */
  set alt(alt) {
    this.setAttribute("alt", alt);
  }
}
