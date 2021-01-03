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

  static get observedAttributes() {
    return ["srcset"];
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

  attributeChangedCallback() {
    this.initSources();
  }

  addPhoto() {
    this.img = document.createElement("img");
    this.initSources();
    this.img.addEventListener("load", () => this.el.dispatchEvent(new Event("img-photo-load")));
    this.img.addEventListener("click", () => this.el.dispatchEvent(new Event("img-photo-click")));

    this.el.appendChild(this.img);
  }

  initSources() {
    if (this.img) {
      if (this.hasAttribute("srcset")) {
        this.img.setAttribute("srcset", this.getAttribute("srcset"));
        this.img.setAttribute("sizes", "(min-width: 320px) 640px");
      } else {
        this.img.removeAttribute("srcset");
        this.img.removeAttribute("sizes");
      }
    }
  }

  clearHeight() {
    this.img.style.height = "";
    this.img.classList.remove("transition");
  }

  setHeight(height) {
    this.img.style.height = height;
    this.img.classList.add("transition");
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
