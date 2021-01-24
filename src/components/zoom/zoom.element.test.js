import "../../index.js";
import { UtilTest } from "../../../test/utiltest.js";

describe("img-zoom", () => {
  it("without content", async () => {
    expect.assertions(3);

    const { zoomSlot } = await UtilTest.initZoom(document);

    expect(zoomSlot).toBeDefined();
    expect(zoomSlot.assignedNodes()).toBeDefined();
    expect(zoomSlot.assignedNodes()).toHaveLength(0);
  });

  it("with non-image", async () => {
    expect.assertions(3);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { zoomSlot } = await UtilTest.initZoom(document, {}, paragraph);

    expect(zoomSlot).toBeDefined();
    expect(zoomSlot.assignedNodes()).toBeDefined();
    expect(zoomSlot.assignedNodes()).toHaveLength(1);
  });

  it("with one image", async () => {
    expect.assertions(3);

    const img = document.createElement("img");
    img.srcset = "focus.png 320w";
    img.size = "100vw";

    const { zoomSlot } = await UtilTest.initZoom(document, {}, img);

    expect(zoomSlot).not.toBeNull();
    expect(zoomSlot.assignedNodes()).toHaveLength(1);
    expect(zoomSlot.assignedNodes()[0].srcset).toStrictEqual("focus.png 320w");
  });

  it("with changing hasprevious attribute", async () => {
    expect.assertions(5);

    const { zoomSlot, imgZoom, zoomPrev } = await UtilTest.initZoom(document, { hasPrevious: true });

    expect(zoomSlot).not.toBeNull();
    expect(zoomPrev.classList.contains("disabled")).toBeFalsy();

    imgZoom.removeAttribute("hasprevious");

    expect(zoomPrev.classList.contains("disabled")).toBeTruthy();

    imgZoom.hasprevious = "";

    expect(zoomPrev.classList.contains("disabled")).toBeFalsy();
    expect(imgZoom.hasprevious).toStrictEqual("");
  });

  it("with changing hasnext attribute", async () => {
    expect.assertions(5);

    const { zoomSlot, imgZoom, zoomNext } = await UtilTest.initZoom(document, { hasNext: true });

    expect(zoomSlot).not.toBeNull();
    expect(zoomNext.classList.contains("disabled")).toBeFalsy();

    imgZoom.removeAttribute("hasnext");

    expect(zoomNext.classList.contains("disabled")).toBeTruthy();

    imgZoom.hasnext = "";

    expect(zoomNext.classList.contains("disabled")).toBeFalsy();
    expect(imgZoom.hasnext).toStrictEqual("");
  });

  it("with default hasprevious and hasnext attributes", async () => {
    expect.assertions(3);

    const { zoomSlot, zoomPrev, zoomNext } = await UtilTest.initZoom(document);

    expect(zoomSlot).not.toBeNull();
    expect(zoomPrev.classList.contains("disabled")).toBeTruthy();
    expect(zoomNext.classList.contains("disabled")).toBeTruthy();
  });
});

describe("img-zoom navigation", () => {
  it("with keyboard", async () => {
    expect.assertions(4);

    const eventCloseSpy = jest.fn(),
      eventNextSpy = jest.fn(),
      eventPrevSpy = jest.fn(),
      img = document.createElement("img");
    img.srcset = "focus.png 320w";
    img.size = "100vw";

    const { zoomSlot, imgZoom } = await UtilTest.initZoom(document, {}, img);
    imgZoom.shadowRoot.addEventListener("img-zoom-prev", eventPrevSpy);
    imgZoom.shadowRoot.addEventListener("img-zoom-next", eventNextSpy);
    imgZoom.shadowRoot.addEventListener("img-zoom-close", eventCloseSpy);
    imgZoom.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }));
    imgZoom.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }));
    imgZoom.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }));
    imgZoom.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    imgZoom.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    // Nothing should happen for this event
    imgZoom.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));

    expect(zoomSlot).not.toBeNull();
    expect(eventPrevSpy).toHaveBeenCalledTimes(2);
    expect(eventNextSpy).toHaveBeenCalledTimes(2);
    expect(eventCloseSpy).toHaveBeenCalledTimes(1);
  });

  it("with actions", async () => {
    expect.assertions(4);

    const clickEvent = new MouseEvent("click", { bubbles: true }),
      eventCloseSpy = jest.fn(),
      eventNextSpy = jest.fn(),
      eventPrevSpy = jest.fn(),
      img = document.createElement("img");
    img.srcset = "focus.png 320w";
    img.size = "100vw";

    const { zoomSlot, imgZoom, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {}, img);
    imgZoom.shadowRoot.addEventListener("img-zoom-prev", eventPrevSpy);
    imgZoom.shadowRoot.addEventListener("img-zoom-next", eventNextSpy);
    imgZoom.shadowRoot.addEventListener("img-zoom-close", eventCloseSpy);
    zoomClose.dispatchEvent(clickEvent);
    zoomNext.dispatchEvent(clickEvent);
    zoomPrev.dispatchEvent(clickEvent);

    expect(zoomSlot).not.toBeNull();
    expect(eventPrevSpy).toHaveBeenCalledTimes(1);
    expect(eventNextSpy).toHaveBeenCalledTimes(1);
    expect(eventCloseSpy).toHaveBeenCalledTimes(1);
  });

  it("with closing click", async () => {
    expect.assertions(4);

    const clickEvent = new MouseEvent("click", { bubbles: true }),
      eventCloseSpy = jest.fn(),
      eventNextSpy = jest.fn(),
      eventPrevSpy = jest.fn(),
      img = document.createElement("img");
    img.srcset = "focus.png 320w";
    img.size = "100vw";

    const { zoomSlot, imgZoom } = await UtilTest.initZoom(document, {}, img);
    imgZoom.shadowRoot.addEventListener("img-zoom-prev", eventPrevSpy);
    imgZoom.shadowRoot.addEventListener("img-zoom-next", eventNextSpy);
    imgZoom.shadowRoot.addEventListener("img-zoom-close", eventCloseSpy);
    img.dispatchEvent(clickEvent);
    zoomSlot.dispatchEvent(clickEvent);

    expect(zoomSlot).not.toBeNull();
    expect(eventPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventNextSpy).toHaveBeenCalledTimes(0);
    expect(eventCloseSpy).toHaveBeenCalledTimes(2);
  });
});
