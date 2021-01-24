import zoomStyles from "./zoom.styles.less";
import zoomTemplate from "./zoom.template.html";

export class ZoomElement extends HTMLElement {
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["hasprevious", "hasnext"];
  }

  attributeChangedCallback() {
    this.updateState();
  }

  connectedCallback() {
    const zoomStylesElement = document.createElement("style"),
      zoomTemplateElement = document.createElement("template");

    zoomStylesElement.textContent = zoomStyles;
    zoomTemplateElement.innerHTML = zoomTemplate;

    this.el.appendChild(zoomStylesElement);
    this.el.appendChild(zoomTemplateElement);
    this.el.appendChild(zoomTemplateElement.content.cloneNode(true));

    this.tabIndex = 0;

    this.setup();
  }

  setup() {
    this.prevElement = this.el.querySelector("#prev");
    this.nextElement = this.el.querySelector("#next");

    this.updateState();

    const CLOSE = "close",
      NEXT = "next",
      PREV = "prev";

    // Close while not clicking on actions
    this.el.querySelector("#zoom").addEventListener("click", (event) => {
      if (![CLOSE, PREV, NEXT].includes(event.target.id)) {
        this.sendEvent(CLOSE);
      }
    });

    // Keyboard navigation
    this.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
          this.sendEvent(PREV);
          break;
        case "ArrowDown":
        case "ArrowRight":
          this.sendEvent(NEXT);
          break;
        case "Escape":
          this.sendEvent(CLOSE);
          break;
        default:
          return;
      }
      event.preventDefault();
    });

    for (const id of [CLOSE, PREV, NEXT]) {
      this.shadowRoot.querySelector(`#${id}`).addEventListener("click", (event) => {
        this.sendEvent(id);
        event.preventDefault();
      });
    }
  }

  updateState() {
    if (this.prevElement) {
      ZoomElement.disable(this.prevElement, !this.hasAttribute("hasprevious"));
    }
    if (this.nextElement) {
      ZoomElement.disable(this.nextElement, !this.hasAttribute("hasnext"));
    }
  }

  static disable(element, disabled) {
    if (disabled) {
      element.classList.add("disabled");
    } else {
      element.classList.remove("disabled");
    }
  }

  sendEvent(id) {
    this.el.dispatchEvent(new Event(`img-zoom-${id}`));
  }

  get hasprevious() {
    return this.getAttribute("hasprevious");
  }

  set hasprevious(hasprevious) {
    this.setAttribute("hasprevious", hasprevious);
  }

  get hasnext() {
    return this.getAttribute("hasnext");
  }

  set hasnext(hasnext) {
    this.setAttribute("hasnext", hasnext);
  }
}
