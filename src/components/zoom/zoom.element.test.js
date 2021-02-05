import "../../index.js";
import { UtilTest } from "../../../test/utiltest.js";

describe("img-zoom", () => {
  it("without content", async () => {
    expect.assertions(3);

    const { zoomSlot } = await UtilTest.initZoom(document, { append: true });

    expect(zoomSlot).toBeDefined();
    expect(zoomSlot.assignedNodes()).toBeDefined();
    expect(zoomSlot.assignedNodes()).toHaveLength(0);
  });

  it("with non-image", async () => {
    expect.assertions(3);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { zoomSlot } = await UtilTest.initZoom(document, { append: true }, paragraph);

    expect(zoomSlot).toBeDefined();
    expect(zoomSlot.assignedNodes()).toBeDefined();
    expect(zoomSlot.assignedNodes()).toHaveLength(1);
  });

  it("with one image", async () => {
    expect.assertions(3);

    const img = document.createElement("img");
    img.srcset = "focus.png 320w";
    img.size = "100vw";

    const { zoomSlot } = await UtilTest.initZoom(document, { append: true }, img);

    expect(zoomSlot).not.toBeNull();
    expect(zoomSlot.assignedNodes()).toHaveLength(1);
    expect(zoomSlot.assignedNodes()[0].srcset).toStrictEqual("focus.png 320w");
  });

  it("with changing hasprevious attribute", async () => {
    expect.assertions(5);

    const { zoomSlot, imgZoom, zoomPrev } = await UtilTest.initZoom(document, { append: true, hasPrevious: true });

    expect(zoomSlot).not.toBeNull();
    expect(zoomPrev.disabled).toBeFalsy();

    imgZoom.removeAttribute("hasprevious");

    expect(zoomPrev.disabled).toBeTruthy();

    imgZoom.hasprevious = "";

    expect(zoomPrev.disabled).toBeFalsy();
    expect(imgZoom.hasprevious).toStrictEqual("");
  });

  it("with changing hasnext attribute", async () => {
    expect.assertions(5);

    const { zoomSlot, imgZoom, zoomNext } = await UtilTest.initZoom(document, { append: true, hasNext: true });

    expect(zoomSlot).not.toBeNull();
    expect(zoomNext.disabled).toBeFalsy();

    imgZoom.removeAttribute("hasnext");

    expect(zoomNext.disabled).toBeTruthy();

    imgZoom.hasnext = "";

    expect(zoomNext.disabled).toBeFalsy();
    expect(imgZoom.hasnext).toStrictEqual("");
  });

  it("with default hasprevious and hasnext attributes", async () => {
    expect.assertions(3);

    const { zoomSlot, zoomPrev, zoomNext } = await UtilTest.initZoom(document, { append: true });

    expect(zoomSlot).not.toBeNull();
    expect(zoomPrev.disabled).toBeTruthy();
    expect(zoomNext.disabled).toBeTruthy();
  });
});

describe("img-zoom navigation", () => {
  it("with keyboard", async () => {
    expect.assertions(4);

    const { zoomSlot, imgZoom } = await UtilTest.initZoom(document, { append: true }),
      eventCloseSpy = jest.fn(),
      eventNextSpy = jest.fn(),
      eventPrevSpy = jest.fn();

    imgZoom.addEventListener("img-zoom-prev", eventPrevSpy);
    imgZoom.addEventListener("img-zoom-next", eventNextSpy);
    imgZoom.addEventListener("img-zoom-close", eventCloseSpy);
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

    const { zoomSlot, imgZoom, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, { append: true }),
      clickEvent = new MouseEvent("click", { bubbles: true }),
      eventCloseSpy = jest.fn(),
      eventNextSpy = jest.fn(),
      eventPrevSpy = jest.fn();

    imgZoom.addEventListener("img-zoom-prev", eventPrevSpy);
    imgZoom.addEventListener("img-zoom-next", eventNextSpy);
    imgZoom.addEventListener("img-zoom-close", eventCloseSpy);
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

    const { zoomSlot, imgZoom } = await UtilTest.initZoom(document, { append: true }, img);
    imgZoom.addEventListener("img-zoom-prev", eventPrevSpy);
    imgZoom.addEventListener("img-zoom-next", eventNextSpy);
    imgZoom.addEventListener("img-zoom-close", eventCloseSpy);
    img.dispatchEvent(clickEvent);
    zoomSlot.dispatchEvent(clickEvent);

    expect(zoomSlot).not.toBeNull();
    expect(eventPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventNextSpy).toHaveBeenCalledTimes(0);
    expect(eventCloseSpy).toHaveBeenCalledTimes(2);
  });
});

describe("img-zoom accessibility", () => {
  it("with previous item", async () => {
    expect.assertions(8);

    const { imgZoom, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasPrevious: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventShiftTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true }),
      eventTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab" });

    zoomPrev.focus();
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);
    zoomClose.addEventListener("focus", eventFocusCloseSpy);

    // Previous to close
    const eventPreventDefaultTab = jest.spyOn(eventTab, "preventDefault");
    imgZoom.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventPreventDefaultTab).toHaveBeenCalledTimes(1);

    // Close to previous
    const eventPreventDefaultShiftTab = jest.spyOn(eventShiftTab, "preventDefault");
    imgZoom.dispatchEvent(eventShiftTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(1);
    expect(eventPreventDefaultShiftTab).toHaveBeenCalledTimes(1);
  });

  it("with next item", async () => {
    expect.assertions(8);

    const { imgZoom, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasNext: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventShiftTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true }),
      eventTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab" });

    zoomNext.focus();
    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    // Next to close
    const eventPreventDefaultTab = jest.spyOn(eventTab, "preventDefault");
    imgZoom.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventPreventDefaultTab).toHaveBeenCalledTimes(1);

    // Close to next
    const eventPreventDefaultShiftTab = jest.spyOn(eventShiftTab, "preventDefault");
    imgZoom.dispatchEvent(eventShiftTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventPreventDefaultShiftTab).toHaveBeenCalledTimes(1);
  });

  it("with previous and next item", async () => {
    expect.assertions(4);

    const { imgZoom, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasNext: true,
        hasPrevious: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab" });

    zoomNext.focus();
    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    // Next to previous should not trigger focus nor prevent default
    const eventPreventDefaultTab = jest.spyOn(eventTab, "preventDefault");
    imgZoom.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventPreventDefaultTab).toHaveBeenCalledTimes(0);
  });

  it("without previous and next", async () => {
    expect.assertions(4);

    const { imgZoom, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, { append: true }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventShiftTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true });

    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    // Close should stay focus by preventing default
    const eventPreventDefaultShiftTab = jest.spyOn(eventShiftTab, "preventDefault");
    imgZoom.dispatchEvent(eventShiftTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventPreventDefaultShiftTab).toHaveBeenCalledTimes(1);
  });
});
