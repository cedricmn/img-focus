/**
 * @file Focus element height update tests.
 */
import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

jest.useFakeTimers();

describe("img-focus layout height update", () => {
  it("should update when growing", async () => {
    expect.assertions(1);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getFocusSlotBoundingSpy = jest.spyOn(focusElement, "getFocusSlotBounding");

    // Simulate initial focus element height
    getFocusSlotBoundingSpy.mockImplementation(() => ({ height: 200 }));
    focusElement.getStore().photos.forEach((photo) => {
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 300,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(focusSlot.style.height).toBe("300px");
  });

  it("should update when reducing enough", async () => {
    expect.assertions(1);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getFocusSlotBoundingSpy = jest.spyOn(focusElement, "getFocusSlotBounding");

    // Simulate initial focus element height
    getFocusSlotBoundingSpy.mockImplementation(() => ({ height: 200 }));
    focusElement.getStore().photos.forEach((photo) => {
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 50,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(focusSlot.style.height).toBe("50px");
  });

  it("should not update when not reducing enough", async () => {
    expect.assertions(1);

    const { focusElement, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).photoElement
      ),
      event = new Event("load", { bubbles: true }),
      getFocusSlotBoundingSpy = jest.spyOn(focusElement, "getFocusSlotBounding");

    // Simulate initial focus element height
    getFocusSlotBoundingSpy.mockImplementation(() => ({ height: 200 }));
    focusElement.getStore().photos.forEach((photo) => {
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 180,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(focusSlot.style.height).toBe("");
  });
});
