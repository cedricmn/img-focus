/**
 * @file Zoom element accessibility tests.
 */
import "../../index.js";
import { describe, expect, it, jest } from '@jest/globals';
import { UtilTest } from "../../../test/utiltest.js";

describe("img-zoom accessibility focus trap", () => {
  it("with previous item", async () => {
    expect.assertions(8);

    const { zoomElement, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasPrevious: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventShiftTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true }),
      eventShiftTabSpy = jest.spyOn(eventShiftTab, "preventDefault"),
      eventTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }),
      eventTabSpy = jest.spyOn(eventTab, "preventDefault");

    zoomPrev.focus();
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);
    zoomClose.addEventListener("focus", eventFocusCloseSpy);

    // Previous to close
    zoomElement.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventTabSpy).toHaveBeenCalledTimes(1);

    // Close to previous
    zoomElement.dispatchEvent(eventShiftTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(1);
    expect(eventShiftTabSpy).toHaveBeenCalledTimes(1);
  });

  it("with next item", async () => {
    expect.assertions(8);

    const { zoomElement, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasNext: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventShiftTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true }),
      eventShiftTabSpy = jest.spyOn(eventShiftTab, "preventDefault"),
      eventTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }),
      eventTabSpy = jest.spyOn(eventTab, "preventDefault");

    zoomNext.focus();
    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    // Next to close
    zoomElement.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventTabSpy).toHaveBeenCalledTimes(1);

    // Close to next
    zoomElement.dispatchEvent(eventShiftTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventShiftTabSpy).toHaveBeenCalledTimes(1);
  });

  it("with previous and next item", async () => {
    expect.assertions(12);

    const { zoomElement, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasNext: true,
        hasPrevious: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }),
      eventTabSpy = jest.spyOn(eventTab, "preventDefault");

    zoomNext.focus();
    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    // Next to previous
    zoomElement.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(1);
    expect(eventTabSpy).toHaveBeenCalledTimes(1);

    // Previous to close
    zoomElement.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(1);
    expect(eventTabSpy).toHaveBeenCalledTimes(2);

    // Close to next
    zoomElement.dispatchEvent(eventTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(1);
    expect(eventTabSpy).toHaveBeenCalledTimes(3);
  });

  it("without previous and next", async () => {
    expect.assertions(4);

    const { zoomElement, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, { append: true }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn(),
      eventShiftTab = new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true }),
      eventShiftTabSpy = jest.spyOn(eventShiftTab, "preventDefault");

    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    // Close should stay focus by preventing default
    zoomElement.dispatchEvent(eventShiftTab);

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
    expect(eventShiftTabSpy).toHaveBeenCalledTimes(1);
  });
});

describe("img-zoom accessibility disabling actions", () => {
  it("with previous and next item disabling next", async () => {
    expect.assertions(3);

    const { zoomElement, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasNext: true,
        hasPrevious: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn();

    zoomNext.focus();
    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    zoomElement.removeAttribute("hasnext");

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
  });

  it("with previous and next item disabling previous", async () => {
    expect.assertions(3);

    const { zoomElement, zoomClose, zoomNext, zoomPrev } = await UtilTest.initZoom(document, {
        append: true,
        hasNext: true,
        hasPrevious: true,
      }),
      eventFocusCloseSpy = jest.fn(),
      eventFocusNextSpy = jest.fn(),
      eventFocusPrevSpy = jest.fn();

    zoomPrev.focus();
    zoomClose.addEventListener("focus", eventFocusCloseSpy);
    zoomNext.addEventListener("focus", eventFocusNextSpy);
    zoomPrev.addEventListener("focus", eventFocusPrevSpy);

    zoomElement.removeAttribute("hasprevious");

    expect(eventFocusCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventFocusNextSpy).toHaveBeenCalledTimes(0);
    expect(eventFocusPrevSpy).toHaveBeenCalledTimes(0);
  });
});
