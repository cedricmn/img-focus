/**
 * @file Focus element layout triggering tests.
 */
import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

jest.useFakeTimers();

describe("img-focus layout triggering", () => {
  it("should layout while loading", async () => {
    expect.assertions(2);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    // Trigger layout
    focusSlot
      .assignedNodes()[0]
      .getImg()
      .dispatchEvent(new Event("load", { bubbles: true }));

    jest.runAllTimers();

    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
  });

  it("should layout when photo ready", async () => {
    expect.assertions(4);

    const { focusElement } = await UtilTest.initFocus(document),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    expect(resetStyleSpy).toHaveBeenCalledTimes(0);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(0);

    // Trigger layout by slotting photo
    const { photoElement } = await UtilTest.initPhoto(document, { height: 100, srcset: "focus.png 320w", width: 200 });
    await focusElement.appendChild(photoElement);

    jest.runAllTimers();

    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
  });

  it("should layout while resizing", async () => {
    expect.assertions(4);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      event = new Event("resize-mock", { bubbles: true }),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    // Trigger layout
    focusSlot.dispatchEvent(event);

    jest.runAllTimers();

    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);

    resetStyleSpy.mockClear();
    layoutInternalSpy.mockClear();

    // No layout
    focusSlot.dispatchEvent(event);

    expect(resetStyleSpy).not.toHaveBeenCalled();
    expect(layoutInternalSpy).not.toHaveBeenCalled();
  });

  it("should debounce layout while loading more photos", async () => {
    expect.assertions(6);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles");

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
    expect(layoutInternalSpy).not.toHaveBeenCalled();

    resetStyleSpy.mockClear();

    jest.advanceTimersByTime(100);

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    expect(resetStyleSpy).not.toHaveBeenCalled();
    expect(layoutInternalSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(resetStyleSpy).not.toHaveBeenCalled();
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
  });

  it("should layout two times when scrollbar appears", async () => {
    expect.assertions(8);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getFocusSlotBoundingSpy = jest.spyOn(focusElement, "getFocusSlotBounding"),
      layoutInternalSpy = jest.spyOn(focusElement.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(focusElement.layout, "resetStyles"),
      updateDomSpy = jest.spyOn(focusElement.layout, "updateDom"),
      updateHeightSpy = jest.spyOn(focusElement.layout, "updateHeight");

    // Simulate initial focus element width
    getFocusSlotBoundingSpy.mockImplementation(() => ({ width: 1080 }));

    // Reduce focus element width after first layout
    updateHeightSpy.mockImplementation(() => getFocusSlotBoundingSpy.mockImplementation(() => ({ width: 1060 })));

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
    expect(updateDomSpy).toHaveBeenCalledTimes(0);
    expect(updateHeightSpy).toHaveBeenCalledTimes(1);

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(layoutInternalSpy).toHaveBeenCalledTimes(2);
    expect(resetStyleSpy).toHaveBeenCalledTimes(2);
    expect(updateDomSpy).toHaveBeenCalledTimes(1);
    expect(updateHeightSpy).toHaveBeenCalledTimes(2);
  });
});
