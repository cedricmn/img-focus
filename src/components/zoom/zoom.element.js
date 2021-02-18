/**
 * @file Zoom element.
 */
import { Util } from "../../util/util";
import zoomStyles from "./zoom.styles.less";
import zoomTemplate from "./zoom.template.html";

const CLOSE = "close",
  NEXT = "next",
  PREV = "prev";

/**
 * Zoom element.
 */
export class ZoomElement extends HTMLElement {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
  }

  /**
   * Zoom observed attributes.
   *
   * @returns {string[]} Observed attributes.
   */
  static get observedAttributes() {
    return ["hasprevious", "hasnext"];
  }

  /**
   * Update actions when zoom element attributes are updated.
   */
  attributeChangedCallback() {
    this.updateActions();
  }

  /**
   * Initialiaze element.
   */
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

  /**
   * Setup element.
   */
  setup() {
    this.prevElement = this.el.querySelector(`#${PREV}`);
    this.nextElement = this.el.querySelector(`#${NEXT}`);
    this.closeElement = this.el.querySelector(`#${CLOSE}`);
    this.actions = [this.closeElement, this.nextElement, this.prevElement];

    this.updateActions();
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

  /**
   * Add keyboad event listener to manage keyboard navigation.
   */
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

  /**
   * Update available actions based on zoom attributes.
   */
  updateActions() {
    if (this.prevElement) {
      Util.setBooleanAttribute(this.prevElement, "disabled", !this.hasAttribute("hasprevious"));
    }
    if (this.nextElement) {
      Util.setBooleanAttribute(this.nextElement, "disabled", !this.hasAttribute("hasnext"));
    }
  }

  /**
   * Disaptch zoom event.
   *
   * @param {string} id - Zoom event name.
   */
  sendEvent(id) {
    this.dispatchEvent(new Event(`img-zoom-${id}`));
  }

  /**
   * Get "hasprevious" attribute value.
   *
   * @returns {string} "hasprevious" attribute value.
   */
  get hasprevious() {
    return this.getAttribute("hasprevious");
  }

  /**
   * Set "hasprevious" attribute.
   */
  set hasprevious(hasprevious) {
    this.setAttribute("hasprevious", hasprevious);
  }

  /**
   * Get "hasnext" attribute value.
   *
   * @returns {string} "hasnext" attribute value.
   */
  get hasnext() {
    return this.getAttribute("hasnext");
  }

  /**
   * Set "hasnext" attribute.
   */
  set hasnext(hasnext) {
    this.setAttribute("hasnext", hasnext);
  }
}
