import zoomStyles from "./zoom.styles.less";
import zoomTemplate from "./zoom.template.html";

export class ZoomElement extends HTMLElement {
  constructor() {
    super();
    this.el = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const zoomStylesElement = document.createElement("style"),
      zoomTemplateElement = document.createElement("template");

    zoomStylesElement.textContent = zoomStyles;
    zoomTemplateElement.innerHTML = zoomTemplate;

    this.el.appendChild(zoomStylesElement);
    this.el.appendChild(zoomTemplateElement);
    this.el.appendChild(zoomTemplateElement.content.cloneNode(true));

    this.addHandlers();
  }

  addHandlers() {
    const idList = ["close", "prev", "next"];

    for (const id of idList) {
      this.shadowRoot.querySelector(`#${id}`).addEventListener("click", () => {
        const event = new Event(`img-zoom-${id}`);

        this.el.dispatchEvent(event);
      });
    }
  }
}
