/**
 * @file Photo element tests.
 */
import "../../index.js";
import { UtilTest } from "../../../test/utiltest";
import { jest } from "@jest/globals";

describe("img-photo", () => {
  it("without attributes", async () => {
    expect.assertions(3);

    const { photoElement } = await UtilTest.initPhoto(document, { append: true });

    expect(photoElement).not.toBeNull();
    expect(photoElement.getImg().hasAttribute("srcset")).toBeFalsy();
    expect(photoElement.getImg().sizes).toBe("(min-width: 50em) 15vw, 100vw");
  });

  it("with changing srcset attribute", async () => {
    expect.assertions(5);

    const { photoElement } = await UtilTest.initPhoto(document, { append: true, srcset: "focus.png 320w" });

    expect(photoElement).not.toBeNull();
    expect(photoElement.getImg().srcset).toBe("focus.png 320w");
    expect(photoElement.getImg().sizes).toBe("(min-width: 50em) 15vw, 100vw");

    photoElement.srcset = "focus2.png 320w";

    expect(photoElement.getImg().srcset).toBe("focus2.png 320w");
    expect(photoElement.getImg().sizes).toBe("(min-width: 50em) 15vw, 100vw");
  });

  it("with changing sizes attribute", async () => {
    expect.assertions(5);

    const { photoElement } = await UtilTest.initPhoto(document, {
      append: true,
      sizes: "(min-width: 50em) 20vw, 100vw",
      srcset: "focus.png 320w",
    });

    expect(photoElement).not.toBeNull();
    expect(photoElement.sizes).toBe("(min-width: 50em) 20vw, 100vw");
    expect(photoElement.getImg().sizes).toBe("(min-width: 50em) 20vw, 100vw");

    photoElement.sizes = "100vw";

    expect(photoElement.sizes).toBe("100vw");
    expect(photoElement.getImg().sizes).toBe("100vw");
  });

  it("with changing width and height attributes", async () => {
    expect.assertions(9);

    const { photoElement } = await UtilTest.initPhoto(document, {
      append: true,
      height: 100,
      srcset: "focus.png 320w",
      width: 200,
    });

    expect(photoElement).not.toBeNull();
    expect(photoElement.height).toBe("100");
    expect(photoElement.getImg().height).toBe(100);
    expect(photoElement.width).toBe("200");
    expect(photoElement.getImg().width).toBe(200);

    photoElement.height = 150;
    photoElement.width = 300;

    expect(photoElement.height).toBe("150");
    expect(photoElement.getImg().height).toBe(150);
    expect(photoElement.width).toBe("300");
    expect(photoElement.getImg().width).toBe(300);
  });

  it("with changing alt attribute", async () => {
    expect.assertions(3);

    const { photoElement } = await UtilTest.initPhoto(document, {
      alt: "Focus photo",
      append: true,
      srcset: "focus.png 320w",
    });

    expect(photoElement).not.toBeNull();
    expect(photoElement.getImg().alt).toBe("Focus photo");

    photoElement.alt = "";

    expect(photoElement.getImg().alt).toBe("");
  });

  it("with overlay", async () => {
    expect.assertions(3);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { photoElement, photoSlot } = await UtilTest.initPhoto(
      document,
      { append: true, srcset: "focus.png 320w" },
      paragraph
    );

    expect(photoElement).not.toBeNull();
    expect(photoSlot.assignedNodes()).toHaveLength(1);
    expect(photoSlot.assignedNodes()[0]).toBe(paragraph);
  });
});

describe("img-photo navigation", () => {
  it("with keyboard", async () => {
    expect.assertions(2);

    const { photoElement } = await UtilTest.initPhoto(document, { append: true, srcset: "focus.png 320w" }),
      eventSelectSpy = jest.fn();
    photoElement.addEventListener("img-photo-select", eventSelectSpy);
    photoElement.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    // Nothing should happen for this event
    photoElement.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));

    expect(photoElement).not.toBeNull();
    expect(eventSelectSpy).toHaveBeenCalledTimes(1);
  });

  it("with click", async () => {
    expect.assertions(2);

    const { photoElement } = await UtilTest.initPhoto(document, { append: true, srcset: "focus.png 320w" }),
      clickEvent = new MouseEvent("click", { bubbles: true }),
      eventSelectSpy = jest.fn();
    photoElement.addEventListener("img-photo-select", eventSelectSpy);
    photoElement.dispatchEvent(clickEvent);

    expect(photoElement).not.toBeNull();
    expect(eventSelectSpy).toHaveBeenCalledTimes(1);
  });
});
