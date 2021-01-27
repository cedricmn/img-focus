import { Util } from "./util";

describe("copy attribute", () => {
  it("without source element", () => {
    expect.assertions(1);

    const target = document.createElement("img");

    Util.copyAttribute(null, target, "src");

    expect(target.hasAttribute("src")).toBeFalsy();
  });

  it("with value", () => {
    expect.assertions(2);

    const source = document.createElement("img"),
      target = document.createElement("img");
    source.src = "focus.png";

    Util.copyAttribute(source, target, "src");

    expect(target.hasAttribute("src")).toBeTruthy();
    expect(target.getAttribute("src")).toStrictEqual("focus.png");
  });

  it("with null", () => {
    expect.assertions(1);

    const source = document.createElement("img"),
      target = document.createElement("img");

    Util.copyAttribute(source, target, "src");

    expect(target.hasAttribute("src")).toBeFalsy();
  });
});

describe("set attribute", () => {
  it("with value", () => {
    expect.assertions(2);

    const element = document.createElement("img");

    Util.setAttribute(element, "src", "focus.png");

    expect(element.hasAttribute("src")).toBeTruthy();
    expect(element.getAttribute("src")).toStrictEqual("focus.png");
  });

  it("with null", () => {
    expect.assertions(1);

    const element = document.createElement("img");

    Util.setAttribute(element, "src", null);

    expect(element.hasAttribute("src")).toBeFalsy();
  });
});

describe("set boolean attribute", () => {
  it("with true", () => {
    expect.assertions(2);

    const element = document.createElement("input");

    Util.setBooleanAttribute(element, "disabled", true);

    expect(element.hasAttribute("disabled")).toBeTruthy();
    expect(element.getAttribute("disabled")).toStrictEqual("");
  });

  it("with false", () => {
    expect.assertions(1);

    const element = document.createElement("input");

    Util.setBooleanAttribute(element, "disabled", null);

    expect(element.hasAttribute("disabled")).toBeFalsy();
  });
});
