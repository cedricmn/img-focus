import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

describe("img-photo", () => {
  it("without attributes", async () => {
    expect.assertions(3);

    const { imgPhoto } = await UtilTest.initPhoto(document);

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.getImg().hasAttribute("srcset")).toBeFalsy();
    expect(imgPhoto.getImg().hasAttribute("sizes")).toBeFalsy();
  });

  it("with changing srcset attribute", async () => {
    expect.assertions(5);

    const { imgPhoto } = await UtilTest.initPhoto(document, { srcset: "focus.png 320w" });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.getImg().srcset).toStrictEqual("focus.png 320w");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 320px) 640px");

    imgPhoto.srcset = "focus2.png 320w";

    expect(imgPhoto.getImg().srcset).toStrictEqual("focus2.png 320w");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 320px) 640px");
  });

  it("with changing alt attribute", async () => {
    expect.assertions(3);

    const { imgPhoto } = await UtilTest.initPhoto(document, { alt: "Focus photo", srcset: "focus.png 320w" });

    expect(imgPhoto).not.toBeNull();
    expect(imgPhoto.getImg().alt).toStrictEqual("Focus photo");

    imgPhoto.alt = "";

    expect(imgPhoto.getImg().alt).toStrictEqual("");
  });

  it("with overlay", async () => {
    expect.assertions(3);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { imgPhoto, photoSlot } = await UtilTest.initPhoto(document, { srcset: "focus.png 320w" }, paragraph);

    expect(imgPhoto).not.toBeNull();
    expect(photoSlot.assignedNodes()).toHaveLength(1);
    expect(photoSlot.assignedNodes()[0]).toStrictEqual(paragraph);
  });
});

describe("img-photo navigation", () => {
  it("with keyboard", async () => {
    expect.assertions(2);

    const { imgPhoto } = await UtilTest.initPhoto(document, { srcset: "focus.png 320w" }),
      eventSelectSpy = jest.fn();
    imgPhoto.shadowRoot.addEventListener("img-photo-select", eventSelectSpy);
    imgPhoto.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    // Nothing should happen for this event
    imgPhoto.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));

    expect(imgPhoto).not.toBeNull();
    expect(eventSelectSpy).toHaveBeenCalledTimes(1);
  });

  it("with click", async () => {
    expect.assertions(2);

    const { imgPhoto } = await UtilTest.initPhoto(document, { srcset: "focus.png 320w" }),
      clickEvent = new MouseEvent("click", { bubbles: true }),
      eventSelectSpy = jest.fn();
    imgPhoto.shadowRoot.addEventListener("img-photo-select", eventSelectSpy);
    imgPhoto.getImg().dispatchEvent(clickEvent);

    expect(imgPhoto).not.toBeNull();
    expect(eventSelectSpy).toHaveBeenCalledTimes(1);
  });
});
