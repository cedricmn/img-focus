import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

describe("img-focus", () => {
  it("with empty sloted content", async () => {
    expect.assertions(1);

    const { focusSlot } = await UtilTest.initFocus(document);

    expect(focusSlot.assignedNodes()).toHaveLength(0);
  });

  it("with paragraph sloted content", async () => {
    expect.assertions(1);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { focusSlot } = await UtilTest.initFocus(document, paragraph);

    expect(focusSlot.assignedNodes()).toHaveLength(1);
  });

  it("with one image sloted content", async () => {
    expect.assertions(5);

    const { focusSlot, zoomSlot } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto
      ),
      event = new MouseEvent("click", { bubbles: true });

    expect(focusSlot.assignedNodes()).toHaveLength(1);
    expect(focusSlot.assignedNodes()[0].srcset).toStrictEqual("focus.png 320w");
    expect(focusSlot.assignedNodes()[0].getImg().srcset).toStrictEqual("focus.png 320w");

    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    expect(zoomSlot.assignedNodes()).toHaveLength(1);
    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("focus.png 320w");
  });

  it("with two images sloted content", async () => {
    expect.assertions(16);

    const { focusSlot, zoomSlot, zoomPrev, zoomNext, zoomClose } = await UtilTest.initFocus(
        document,
        (await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })).imgPhoto,
        (await UtilTest.initPhoto(document, { srcset: "focus2.png 320w" })).imgPhoto
      ),
      event = new MouseEvent("click", { bubbles: true }),
      eventPhotoCloseSpy = jest.fn(),
      eventPhotoOpenSpy = jest.fn();

    document.body.addEventListener("img-focus-photo-open", eventPhotoOpenSpy);
    document.body.addEventListener("img-focus-photo-close", eventPhotoCloseSpy);

    expect(focusSlot.assignedNodes()).toHaveLength(2);
    expect(focusSlot.assignedNodes()[0].srcset).toStrictEqual("focus.png 320w");
    expect(focusSlot.assignedNodes()[1].srcset).toStrictEqual("focus2.png 320w");

    expect(focusSlot.assignedNodes()[0].getImg().srcset).toStrictEqual("focus.png 320w");
    expect(focusSlot.assignedNodes()[1].getImg().srcset).toStrictEqual("focus2.png 320w");

    // Open first image
    focusSlot.assignedNodes()[0].getImg().dispatchEvent(event);

    expect(zoomSlot.assignedNodes()).toHaveLength(1);
    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("focus.png 320w");
    expect(eventPhotoCloseSpy).toHaveBeenCalledTimes(0);
    expect(eventPhotoOpenSpy).toHaveBeenCalledTimes(1);

    // Navigate to next image
    zoomNext.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("focus2.png 320w");

    // Try to navigate to next image
    zoomNext.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("focus2.png 320w");

    // Navigate back to first one
    zoomPrev.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("focus.png 320w");

    // Try to navigate tor previous image
    zoomPrev.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("focus.png 320w");

    // Close preview
    zoomClose.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toStrictEqual("");
    expect(eventPhotoCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventPhotoOpenSpy).toHaveBeenCalledTimes(1);
  });
});
