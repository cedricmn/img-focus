import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

jest.useFakeTimers();

describe("img-focus layout height update", () => {
  it("should update when growing", async () => {
    expect.assertions(1);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getFocusElementBoundingSpy = jest.spyOn(imgFocus, "getFocusElementBounding");

    // Simulate initial focus element height
    getFocusElementBoundingSpy.mockImplementation(() => ({ height: 200 }));
    imgFocus.getStore().photos.forEach((photo) => {
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 300,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(imgFocus.getFocusElement().style.height).toBe("300px");
  });

  it("should update when reducing enough", async () => {
    expect.assertions(1);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getFocusElementBoundingSpy = jest.spyOn(imgFocus, "getFocusElementBounding");

    // Simulate initial focus element height
    getFocusElementBoundingSpy.mockImplementation(() => ({ height: 200 }));
    imgFocus.getStore().photos.forEach((photo) => {
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 50,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(imgFocus.getFocusElement().style.height).toBe("50px");
  });

  it("should not update when not reducing enough", async () => {
    expect.assertions(1);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getFocusElementBoundingSpy = jest.spyOn(imgFocus, "getFocusElementBounding");

    // Simulate initial focus element height
    getFocusElementBoundingSpy.mockImplementation(() => ({ height: 200 }));
    imgFocus.getStore().photos.forEach((photo) => {
      jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
        height: 180,
      }));
    });

    // Trigger layout
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    jest.runAllTimers();

    expect(imgFocus.getFocusElement().style.height).toBe("");
  });
});
