import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

jest.useFakeTimers();

describe("img-focus layout triggering", () => {
  it("should layout while loading", async () => {
    expect.assertions(2);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

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

    const { imgFocus } = await UtilTest.initFocus(document),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

    expect(resetStyleSpy).toHaveBeenCalledTimes(0);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(0);

    // Trigger layout by slotting photo
    const { imgPhoto } = await UtilTest.initPhoto(document, { height: 100, srcset: "focus.png 320w", width: 200 });
    await imgFocus.appendChild(imgPhoto);

    jest.runAllTimers();

    expect(resetStyleSpy).toHaveBeenCalledTimes(1);
    expect(layoutInternalSpy).toHaveBeenCalledTimes(1);
  });

  it("should layout while resizing", async () => {
    expect.assertions(4);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("resize-mock", { bubbles: true }),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

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

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

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

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getFocusElementBoundingSpy = jest.spyOn(imgFocus, "getFocusElementBounding"),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles"),
      updateDomSpy = jest.spyOn(imgFocus.layout, "updateDom"),
      updateHeightSpy = jest.spyOn(imgFocus.layout, "updateHeight");

    // Simulate initial focus element width
    getFocusElementBoundingSpy.mockImplementation(() => ({ width: 1080 }));

    // Reduce focus element width after first layout
    updateHeightSpy.mockImplementation(() => getFocusElementBoundingSpy.mockImplementation(() => ({ width: 1060 })));

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

describe("img-focus layout calculation", () => {
  it("should correct bad Chrome width calculation", async () => {
    expect.assertions(3);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

    /*
     * Simulate bad right photo element calculation in Chrome (should be lower than focus element width)
     * left : photo div element left value
     * right : photo div element right value
     * width : focus element width
     * In this case, photo div element width is calculated using width value (1080 - 1000)
     * instead of right value (1081 - 1000)
     */
    jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ right: 1080 }));

    jest.spyOn(imgFocus.getStore().photos[0], "getBounding").mockImplementation(() => ({
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

  it("should apply computed height for lines except last one", async () => {
    expect.assertions(7);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto,
        (await UtilTest.initPhoto(document, { srcset: "focus2.png 320w" })).imgPhoto,
        (await UtilTest.initPhoto(document, { srcset: "focus3.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

    jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ width: 200 }));

    imgFocus.getStore().photos.forEach((photo, index) => {
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

    expect(focusSlot.style.height).toBe("1010px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("");
  });

  it("should not apply computed height for single line", async () => {
    expect.assertions(7);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto,
        (await UtilTest.initPhoto(document, { srcset: "focus2.png 320w" })).imgPhoto,
        (await UtilTest.initPhoto(document, { srcset: "focus3.png 320w" })).imgPhoto
      ),
      event = new Event("load", { bubbles: true }),
      getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal"),
      resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

    jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ width: 1080 }));

    imgFocus.getStore().photos.forEach((photo, index) => {
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
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("");
  });
});

describe("img-focus layout calculation with provided width and height", () => {
  it("should layout with accurate provided width and height", async () => {
    expect.assertions(6);

    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus.png 320w", width: 100 })).imgPhoto,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus2.png 320w", width: 100 })).imgPhoto,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus3.png 320w", width: 100 })).imgPhoto
      ),
      getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal");

    jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ width: 200 }));

    imgFocus.getStore().photos.forEach((photo, index) => {
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

    expect(focusSlot.style.height).toBe("1010px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("");
  });

  it("should layout with inaccurate provided width and height", async () => {
    expect.assertions(7);

    // With width of 50, 100, 160 instead of 100
    const { imgFocus, focusSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus.png 320w", width: 50 })).imgPhoto,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus2.png 320w", width: 100 })).imgPhoto,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus3.png 320w", width: 160 })).imgPhoto,
        (await UtilTest.initPhoto(document, { height: 200, srcset: "focus3.png 320w", width: 100 })).imgPhoto
      ),
      getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
      layoutInternalSpy = jest.spyOn(imgFocus.layout, "layoutInternal");

    jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ width: 200 }));

    imgFocus.getStore().photos.forEach((photo, index) => {
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

    expect(focusSlot.style.height).toBe("1665px");
    expect(focusSlot.assignedNodes()[0].getImg().style.height).toBe("799.99px");
    expect(focusSlot.assignedNodes()[1].getImg().style.height).toBe("399.99px");
    expect(focusSlot.assignedNodes()[2].getImg().style.height).toBe("249.99px");
    expect(focusSlot.assignedNodes()[3].getImg().style.height).toBe("");
  });
});
