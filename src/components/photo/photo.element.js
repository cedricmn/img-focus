import photoStyles from "./photo.styles.less";
import photoTemplate from "./photo.template.html";

/**
 * Photo custom element
 */
export class PhotoElement extends HTMLElement {
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const photoStylesElement = document.createElement("style"),
      photoTemplateElement = document.createElement("template");

    photoStylesElement.textContent = photoStyles;
    photoTemplateElement.innerHTML = photoTemplate;

    this.el.appendChild(photoStylesElement);
    this.el.appendChild(photoTemplateElement);
    this.el.appendChild(photoTemplateElement.content.cloneNode(true));

    this.addPhoto();
  }

  addPhoto() {
    this.img = document.createElement("img");
    this.img.srcset = this.getAttribute("srcset");
    this.img.sizes = "(min-width: 320px) 640px";
    this.img.addEventListener("load", () => this.el.dispatchEvent(new Event("img-photo-load")));
    this.img.addEventListener("click", () => this.el.dispatchEvent(new Event("img-photo-click")));

    this.el.appendChild(this.img);
  }

  setHeight(height) {
    this.img.style.height = height;
  }

  get srcset() {
    return this.getAttribute("srcset");
  }

  set srcset(srcset) {
    this.setAttribute("srcset", srcset);
  }

  getImg() {
    return this.img;
  }
}
