import { Util } from "../../util/util";
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
    return ["srcset", "alt"];
  }

  connectedCallback() {
    const photoStylesElement = document.createElement("style"),
      photoTemplateElement = document.createElement("template");

    photoStylesElement.textContent = photoStyles;
    photoTemplateElement.innerHTML = photoTemplate;

    this.el.appendChild(photoStylesElement);
    this.el.appendChild(photoTemplateElement);
    this.el.appendChild(photoTemplateElement.content.cloneNode(true));

    this.tabIndex = 0;

    this.setup();
  }

  setup() {
    // Keyboard navigation
    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.el.dispatchEvent(new Event("img-photo-select"));
        event.preventDefault();
      }
    });

    this.img = document.createElement("img");
    this.img.addEventListener("load", () => this.el.dispatchEvent(new Event("img-photo-load")));
    this.img.addEventListener("click", () => this.el.dispatchEvent(new Event("img-photo-select")));
    this.initSources();

    this.el.appendChild(this.img);
  }

  attributeChangedCallback() {
    this.initSources();
  }

  initSources() {
    if (this.img) {
      Util.copyAttribute(this, this.img, "srcset");
      Util.copyAttribute(this, this.img, "alt");
      if (this.hasAttribute("srcset")) {
        this.img.setAttribute("sizes", "(min-width: 320px) 640px");
      } else {
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

  getImg() {
    return this.img;
  }

  get srcset() {
    return this.getAttribute("srcset");
  }

  set srcset(srcset) {
    this.setAttribute("srcset", srcset);
  }

  get alt() {
    return this.getAttribute("alt");
  }

  set alt(alt) {
    this.setAttribute("alt", alt);
  }
}
