import { Util } from "../../util/util";
import zoomStyles from "./zoom.styles.less";
import zoomTemplate from "./zoom.template.html";

const CLOSE = "close",
  NEXT = "next",
  PREV = "prev";

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
    Util.setAttribute(this, "role", "dialog");

    this.setup();
  }

  setup() {
    this.prevElement = this.el.querySelector("#prev");
    this.nextElement = this.el.querySelector("#next");
    this.closeElement = this.el.querySelector("#close");

    this.updateState();
    this.addKeydownEventListener();

    // Close while not clicking on actions
    this.el.querySelector("#zoom").addEventListener("click", (event) => {
      if (![CLOSE, PREV, NEXT].includes(event.target.id)) {
        this.sendEvent(CLOSE);
      }
    });

    for (const id of [CLOSE, PREV, NEXT]) {
      this.shadowRoot.querySelector(`#${id}`).addEventListener("click", (event) => {
        this.sendEvent(id);
        event.preventDefault();
      });
    }
  }

  addKeydownEventListener() {
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
        case "Tab":
          // Wrap tabbing
          if (event.shiftKey && (this.el.activeElement === this.closeElement || this.el.activeElement === null)) {
            if (this.hasAttribute("hasprevious")) {
              this.prevElement.focus();
            } else if (this.hasAttribute("hasnext")) {
              this.nextElement.focus();
            }
          } else if (
            (!event.shiftKey && this.el.activeElement === this.prevElement) ||
            (this.el.activeElement === this.nextElement && !this.hasAttribute("hasprevious"))
          ) {
            this.closeElement.focus();
          } else {
            return;
          }
          break;
        default:
          return;
      }
      event.preventDefault();
    });
  }

  updateState() {
    if (this.prevElement) {
      Util.setBooleanAttribute(this.prevElement, "disabled", !this.hasAttribute("hasprevious"));
    }
    if (this.nextElement) {
      Util.setBooleanAttribute(this.nextElement, "disabled", !this.hasAttribute("hasnext"));
    }
  }

  sendEvent(id) {
    this.dispatchEvent(new Event(`img-zoom-${id}`));
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
