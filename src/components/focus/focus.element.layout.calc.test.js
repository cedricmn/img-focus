/**
 * @file Focus element layout calculation tests.
 */
import "../../index.js";
import { UtilTest } from "../../../test/utiltest";
import { jest } from "@jest/globals";

jest.useFakeTimers();

describe("img-focus layout calculation", () => {
  it("should correct bad Chrome width calculation", async () => {
    expect.assertions(3);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (
          await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })
        ).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getCorrectedWidthSpy = jest.spyOn(focusElement.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    /*
     * Simulate bad right photo element calculation in Chrome (should be lower than focus element width)
     * left : photo div element left value
     * right : photo div element right value
     * width : focus element width
     * In this case, photo div element width is calculated using width value (1080 - 1000)
     * instead of right value (1081 - 1000)
     */
    jest.spyOn(focusElement, "getFocusSlotBounding").mockImplementation(() => ({ right: 1080 }));

    jest.spyOn(focusElement.getStore().photos[0], "getBounding").mockImplementation(() => ({
      left: 1000,
      right: 1081,
    }));

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(getCorrectedWidthSpy).toHaveReturnedWith(80);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
  });

  it("should apply computed height", async () => {
    expect.assertions(7);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (
          await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { srcset: "focus2.png 320w" })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { srcset: "focus3.png 320w" })
        ).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getCorrectedWidthSpy = jest.spyOn(focusElement.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    jest.spyOn(focusElement, "getFocusSlotBounding").mockImplementation(() => ({ width: 200 }));

    focusElement.getStore().photos.forEach((photo, index) => {
      const shift = 205 * index;
      jest.spyOn(photo, "getBounding").mockImplementation(() => ({
        left: 0,
        right: 200,
      }));
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        bottom: 200 + shift,
        height: 200,
        left: 50,
        right: 150,
        top: shift,
        width: 100,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(getCorrectedWidthSpy).toHaveBeenCalledTimes(3);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
    expect(resetStyleSpy).toHaveBeenCalledTimes(1);

    expect(focusSlot.style.height).toBe("1210px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("399.99px");
  });

  it("should not apply computed height for single line", async () => {
    expect.assertions(7);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (
          await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { srcset: "focus2.png 320w" })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { srcset: "focus3.png 320w" })
        ).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getCorrectedWidthSpy = jest.spyOn(focusElement.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    jest.spyOn(focusElement, "getFocusSlotBounding").mockImplementation(() => ({ width: 1080 }));

    focusElement.getStore().photos.forEach((photo, index) => {
      const shift = index * 200;
      jest.spyOn(photo, "getBounding").mockImplementation(() => ({
        left: 0 + shift,
        right: 200 + shift,
      }));
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 200,
        left: 50 + shift,
        right: 150 + shift,
        width: 100,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(getCorrectedWidthSpy).toHaveBeenCalledTimes(3);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
    expect(resetStyleSpy).toHaveBeenCalledTimes(1);

    expect(focusSlot.style.height).toBe("200px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("199.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("199.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("199.99px");
  });
});

describe("img-focus layout calculation with provided width and height", () => {
  it("should layout with accurate provided width and height", async () => {
    expect.assertions(6);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus.png 320w", width: 100 })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus2.png 320w", width: 100 })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus3.png 320w", width: 100 })
        ).photoElement
      ),
      getCorrectedWidthSpy = jest.spyOn(focusElement.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal");

    jest.spyOn(focusElement, "getFocusSlotBounding").mockImplementation(() => ({ width: 200 }));

    focusElement.getStore().photos.forEach((photo, index) => {
      const shift = 205 * index;
      jest.spyOn(photo, "getBounding").mockImplementation(() => ({
        left: 0,
        right: 200,
      }));
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        bottom: 200 + shift,
        height: 200,
        left: 50,
        right: 150,
        top: shift,
        width: 100,
      }));
    });

    jest.runAllTimers();

    expect(getCorrectedWidthSpy).toHaveBeenCalledTimes(3);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);

    expect(focusSlot.style.height).toBe("1210px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("399.99px");
  });

  it("should layout with inaccurate provided width and height", async () => {
    expect.assertions(7);

    // With width of 50, 100, 160 instead of 100
    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus.png 320w", width: 50 })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus2.png 320w", width: 100 })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus3.png 320w", width: 160 })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { height: 200, srcset: "focus3.png 320w", width: 100 })
        ).photoElement
      ),
      getCorrectedWidthSpy = jest.spyOn(focusElement.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal");

    jest.spyOn(focusElement, "getFocusSlotBounding").mockImplementation(() => ({ width: 200 }));

    focusElement.getStore().photos.forEach((photo, index) => {
      const shift = 205 * index;
      jest.spyOn(photo, "getBounding").mockImplementation(() => ({
        left: 0,
        right: 200,
      }));
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        bottom: 200 + shift,
        height: 200,
        left: 50,
        right: 150,
        top: shift,
        width: 100,
      }));
    });

    jest.runAllTimers();

    expect(getCorrectedWidthSpy).toHaveBeenCalledTimes(4);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);

    expect(focusSlot.style.height).toBe("1865px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("799.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("249.99px");
    expect(focusSlot.assignedNodes()[3].getImg().style.height).toBe("399.99px");
  });
});
