/**
 * @file Focus element tests.
 */
import "../../index.js";
import { UtilTest } from "../../../test/utiltest";
import { jest } from "@jest/globals";

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
        (
          await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })
        ).photoElement
      ),
      event = new MouseEvent("click", { bubbles: true });

    expect(focusSlot.assignedNodes()).toHaveLength(1);
    expect(focusSlot.assignedNodes()[0].srcset).toBe("focus.png 320w");
    expect(focusSlot.assignedNodes()[0].getImg().srcset).toBe("focus.png 320w");

    focusSlot.assignedNodes()[0].dispatchEvent(event);

    expect(zoomSlot.assignedNodes()).toHaveLength(1);
    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("focus.png 320w");
  });

  it("with two images sloted content", async () => {
    expect.assertions(15);

    const { focusSlot, zoomSlot, zoomPrev, zoomNext, zoomClose } = await UtilTest.initFocus(
        document,
        (
          await UtilTest.initPhoto(document, { srcset: "focus.png 320w" })
        ).photoElement,
        (
          await UtilTest.initPhoto(document, { srcset: "focus2.png 320w" })
        ).photoElement
      ),
      event = new MouseEvent("click", { bubbles: true }),
      eventPhotoCloseSpy = jest.fn(),
      eventPhotoOpenSpy = jest.fn();

    document.body.addEventListener("img-focus-photo-open", eventPhotoOpenSpy);
    document.body.addEventListener("img-focus-photo-close", eventPhotoCloseSpy);

    expect(focusSlot.assignedNodes()).toHaveLength(2);
    expect(focusSlot.assignedNodes()[0].srcset).toBe("focus.png 320w");
    expect(focusSlot.assignedNodes()[1].srcset).toBe("focus2.png 320w");
    expect(focusSlot.assignedNodes()[0].getImg().srcset).toBe("focus.png 320w");
    expect(focusSlot.assignedNodes()[1].getImg().srcset).toBe("focus2.png 320w");

    // Open first image
    focusSlot.assignedNodes()[0].dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("focus.png 320w");
    expect(eventPhotoCloseSpy).toHaveBeenCalledTimes(0);
    expect(eventPhotoOpenSpy).toHaveBeenCalledTimes(1);

    // Navigate to next image
    zoomNext.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("focus2.png 320w");

    // Try to navigate to next image
    zoomNext.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("focus2.png 320w");

    // Navigate back to first one
    zoomPrev.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("focus.png 320w");

    // Try to navigate tor previous image
    zoomPrev.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("focus.png 320w");

    // Close preview
    zoomClose.dispatchEvent(event);

    expect(zoomSlot.assignedNodes()[0].querySelector("#zoom-image").srcset).toBe("");
    expect(eventPhotoCloseSpy).toHaveBeenCalledTimes(1);
    expect(eventPhotoOpenSpy).toHaveBeenCalledTimes(1);
  });
});
