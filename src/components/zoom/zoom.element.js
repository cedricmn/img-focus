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

    this.tabIndex = -1;
    Util.setAttribute(this, "role", "dialog");
    Util.setAttribute(this, "aria-label", "Display photo");

    this.setup();
  }

  setup() {
    this.prevElement = this.el.querySelector(`#${PREV}`);
    this.nextElement = this.el.querySelector(`#${NEXT}`);
    this.closeElement = this.el.querySelector(`#${CLOSE}`);
    this.actions = [this.closeElement, this.nextElement, this.prevElement];

    this.updateState();
    this.addKeydownEventListener();

    // Default focus on close
    this.addEventListener("focus", () => {
      if (!this.el.activeElement) {
        this.closeElement.focus();
      }
    });

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
        case "Tab": {
          // Wrap tabbing
          let activeActions = this.actions.filter((action) => !action.disabled);
          if (activeActions.length > 1) {
            if (event.shiftKey) {
              activeActions = activeActions.reverse();
            }
            activeActions[(activeActions.indexOf(this.el.activeElement) + 1) % activeActions.length].focus();
          }
          break;
        }
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
