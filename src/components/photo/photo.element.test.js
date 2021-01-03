import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

describe("img-photo test", () => {
  it("with no attributes", async () => {
    expect.assertions(2);

    const { imgPhoto } = await UtilTest.initPhoto(document);

    expect(imgPhoto.getImg().hasAttribute("srcset")).toBeFalsy();
    expect(imgPhoto.getImg().hasAttribute("sizes")).toBeFalsy();
  });

  it("with changing srcset attribute", async () => {
    expect.assertions(4);

    const { imgPhoto } = await UtilTest.initPhoto(document, "focus.png 320w");

    expect(imgPhoto.getImg().srcset).toStrictEqual("focus.png 320w");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 320px) 640px");

    imgPhoto.srcset = "focus2.png 320w";

    expect(imgPhoto.getImg().srcset).toStrictEqual("focus2.png 320w");
    expect(imgPhoto.getImg().sizes).toStrictEqual("(min-width: 320px) 640px");
  });

  it("with overlay", async () => {
    expect.assertions(2);

    const paragraph = document.createElement("p");
    paragraph.append("A paragraph");

    const { photoSlot } = await UtilTest.initPhoto(document, "focus.png 320w", paragraph);

    expect(photoSlot.assignedNodes()).toHaveLength(1);
    expect(photoSlot.assignedNodes()[0]).toStrictEqual(paragraph);
  });
});
