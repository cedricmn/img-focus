import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

describe("img-photo", () => {
  it("without attributes", async () => {
    expect.assertions(3);

    const { imgPhoto } = await UtilTest.initPhoto(document, { append: true });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.getImg().hasAttribute("srcset")).toBeFalsy();
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 50em) 15vw, 100vw");
  });

  it("with changing srcset attribute", async () => {
    expect.assertions(5);

    const { imgPhoto } = await UtilTest.initPhoto(document, { append: true, srcset: "focus.png 320w" });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.getImg().srcset).toStrictEqual("focus.png 320w");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 50em) 15vw, 100vw");

    imgPhoto.srcset = "focus2.png 320w";

    expect(imgPhoto.getImg().srcset).toStrictEqual("focus2.png 320w");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 50em) 15vw, 100vw");
  });

  it("with changing sizes attribute", async () => {
    expect.assertions(5);

    const { imgPhoto } = await UtilTest.initPhoto(document, {
      append: true,
      sizes: "(min-width: 50em) 20vw, 100vw",
      srcset: "focus.png 320w",
    });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.sizes).toStrictEqual("(min-width: 50em) 20vw, 100vw");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 50em) 20vw, 100vw");

    imgPhoto.sizes = "100vw";

    expect(imgPhoto.sizes).toStrictEqual("100vw");
    expect(imgPhoto.getImg().sizes).toStrictEqual("100vw");
  });

  it("with changing width and height attributes", async () => {
    expect.assertions(9);

    const { imgPhoto } = await UtilTest.initPhoto(document, {
      append: true,
      height: 100,
      srcset: "focus.png 320w",
      width: 200,
    });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.height).toStrictEqual("100");
    expect(imgPhoto.getImg().height).toStrictEqual(100);
    expect(imgPhoto.width).toStrictEqual("200");
    expect(imgPhoto.getImg().width).toStrictEqual(200);

    imgPhoto.height = 150;
    imgPhoto.width = 300;

    expect(imgPhoto.height).toStrictEqual("150");
    expect(imgPhoto.getImg().height).toStrictEqual(150);
    expect(imgPhoto.width).toStrictEqual("300");
    expect(imgPhoto.getImg().width).toStrictEqual(300);
  });

  it("with changing alt attribute", async () => {
    expect.assertions(3);

    const { imgPhoto } = await UtilTest.initPhoto(document, {
      alt: "Focus photo",
      append: true,
      srcset: "focus.png 320w",
    });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.getImg().alt).toStrictEqual("Focus photo");

    imgPhoto.alt = "";

    expect(imgPhoto.getImg().alt).toStrictEqual("");
  });

  it("with overlay", async () => {
    expect.assertions(3);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { imgPhoto, photoSlot } = await UtilTest.initPhoto(
      document,
      { append: true, srcset: "focus.png 320w" },
      paragraph
    );

    expect(imgPhoto).not.toBeNull();
    expect(photoSlot.assignedNodes()).toHaveLength(1);
    expect(photoSlot.assignedNodes()[0]).toStrictEqual(paragraph);
  });
});

describe("img-photo navigation", () => {
  it("with keyboard", async () => {
    expect.assertions(2);

    const { imgPhoto } = await UtilTest.initPhoto(document, { append: true, srcset: "focus.png 320w" }),
      eventSelectSpy = jest.fn();
    imgPhoto.addEventListener("img-photo-select", eventSelectSpy);
    imgPhoto.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    // Nothing should happen for this event
    imgPhoto.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));

    expect(imgPhoto).not.toBeNull();
    expect(eventSelectSpy).toHaveBeenCalledTimes(1);
  });

  it("with click", async () => {
    expect.assertions(2);

    const { imgPhoto } = await UtilTest.initPhoto(document, { append: true, srcset: "focus.png 320w" }),
      clickEvent = new MouseEvent("click", { bubbles: true }),
      eventSelectSpy = jest.fn();
    imgPhoto.addEventListener("img-photo-select", eventSelectSpy);
    imgPhoto.dispatchEvent(clickEvent);

    expect(imgPhoto).not.toBeNull();
    expect(eventSelectSpy).toHaveBeenCalledTimes(1);
  });
});
