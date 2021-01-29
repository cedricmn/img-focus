import { FocusElement } from "./components/focus/focus.element.js";
import { PhotoElement } from "./components/photo/photo.element.js";
import { ZoomElement } from "./components/zoom/zoom.element.js";

// Focus web components
window.customElements.define("img-zoom", ZoomElement);
window.customElements.define("img-photo", PhotoElement);
window.customElements.define("img-focus", FocusElement);
