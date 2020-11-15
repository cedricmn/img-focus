import "../../index.js";
import { UtilTest } from "../../../test/utiltest";

describe("img-focus layout triggering", () => {

    it("should layout while loading", async () => {

        expect.assertions(1);

        const { imgFocus, focusImgs } =
            await UtilTest.initFocus(document, UtilTest.initPhoto(document, "focus.png 320w")),
            resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

        // Trigger layout
        focusImgs[0].dispatchEvent(new Event("load", { "bubbles": true }));

        expect(resetStyleSpy).toHaveBeenCalledWith();

    });

    it("should layout while resizing", async () => {

        expect.assertions(4);

        const { imgFocus, focus } =
            await UtilTest.initFocus(document, UtilTest.initPhoto(document, "focus.png 320w")),
            event = new Event("resize-mock", { "bubbles": true }),
            onePassLayoutSpy = jest.spyOn(imgFocus.layout, "onePassLayout"),
            resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

        // Trigger layout
        focus.dispatchEvent(event);

        expect(resetStyleSpy).toHaveBeenCalledTimes(1);
        expect(onePassLayoutSpy).toHaveBeenCalledTimes(1);

        // No layout
        focus.dispatchEvent(event);

        expect(resetStyleSpy).toHaveBeenCalledTimes(1);
        expect(onePassLayoutSpy).toHaveBeenCalledTimes(1);

    });

    it("should layout two times when scrollbar appears", async () => {

        expect.assertions(2);

        const { imgFocus, focusImgs } =
            await UtilTest.initFocus(document, UtilTest.initPhoto(document, "focus.png 320w")),
            getFocusElementBoundingSpy = jest.spyOn(imgFocus, "getFocusElementBounding"),
            onePassLayoutSpy = jest.spyOn(imgFocus.layout, "onePassLayout"),
            resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

        // Simulate initial focus element width
        getFocusElementBoundingSpy.mockImplementation(() => ({ "width": 1080 }));

        // Reduce focus element width after first layout
        onePassLayoutSpy.
            mockImplementation(() => getFocusElementBoundingSpy.mockImplementation(() => ({ "width": 1060 })));

        // Trigger layout
        focusImgs[0].dispatchEvent(new Event("load", { "bubbles": true }));

        expect(resetStyleSpy).toHaveBeenCalledTimes(2);
        expect(onePassLayoutSpy).toHaveBeenCalledTimes(2);

    });

});

describe("img-focus layout calculation", () => {

    it("should correct bad Chrome width calculation", async () => {

        expect.assertions(3);

        const { imgFocus, focusImgs } =
            await UtilTest.initFocus(document, UtilTest.initPhoto(document, "focus.png 320w")),
            getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
            onePassLayoutSpy = jest.spyOn(imgFocus.layout, "onePassLayout"),
            resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

        /*
         * Simulate bad right photo element calculation in Chrome (should be lower than focus element width)
         * left : photo div element left value
         * right : photo div element right value
         * width : focus element width
         * In this case, photo div element width is calculated using width value (1080 - 1000)
         * instead of right value (1081 - 1000)
         */
        jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ "width": 1080 }));

        jest.spyOn(imgFocus.getStore().photos[0], "getDivBounding").mockImplementation(() => ({
            "left": 1000,
            "right": 1081
        }));

        // Trigger layout
        focusImgs[0].dispatchEvent(new Event("load", { "bubbles": true }));

        expect(getCorrectedWidthSpy).toHaveReturnedWith(80);
        expect(onePassLayoutSpy).toHaveBeenCalledTimes(1);
        expect(resetStyleSpy).toHaveBeenCalledTimes(1);

    });

    it("should apply computed height for lines except last one", async () => {

        expect.assertions(6);

        const { imgFocus, focusImgs } =
            await UtilTest.initFocus(
                document,
                UtilTest.initPhoto(document, "focus.png 320w"),
                UtilTest.initPhoto(document, "focus2.png 320w"),
                UtilTest.initPhoto(document, "focus3.png 320w")
            ),
            getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
            onePassLayoutSpy = jest.spyOn(imgFocus.layout, "onePassLayout"),
            resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

        jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ "width": 200 }));

        imgFocus.getStore().photos.forEach((photo) => {

            jest.spyOn(photo, "getDivBounding").mockImplementation(() => ({
                "left": 0,
                "right": 200
            }));
            jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
                "height": 200,
                "left": 50,
                "right": 150,
                "width": 100
            }));

        });

        // Trigger layout
        focusImgs[0].dispatchEvent(new Event("load", { "bubbles": true }));

        expect(getCorrectedWidthSpy).toHaveBeenCalledTimes(3);
        expect(onePassLayoutSpy).toHaveBeenCalledTimes(1);
        expect(resetStyleSpy).toHaveBeenCalledTimes(1);

        expect(focusImgs[0].style.height).toBe("399.99px");
        expect(focusImgs[1].style.height).toBe("399.99px");
        expect(focusImgs[2].style.height).toBe("");

    });

    it("should not apply computed height for single line", async () => {

        expect.assertions(6);

        const { imgFocus, focusImgs } =
            await UtilTest.initFocus(
                document,
                UtilTest.initPhoto(document, "focus.png 320w"),
                UtilTest.initPhoto(document, "focus2.png 320w"),
                UtilTest.initPhoto(document, "focus3.png 320w")
            ),
            getCorrectedWidthSpy = jest.spyOn(imgFocus.layout, "getCorrectedWidth"),
            onePassLayoutSpy = jest.spyOn(imgFocus.layout, "onePassLayout"),
            resetStyleSpy = jest.spyOn(imgFocus.layout, "resetStyles");

        jest.spyOn(imgFocus, "getFocusElementBounding").mockImplementation(() => ({ "width": 1080 }));

        imgFocus.getStore().photos.forEach((photo, index) => {

            const shift = index * 200;
            jest.spyOn(photo, "getDivBounding").mockImplementation(() => ({
                "left": 0 + shift,
                "right": 200 + shift
            }));
            jest.spyOn(photo, "getImgBounding").mockImplementation(() => ({
                "height": 200,
                "left": 50 + shift,
                "right": 150 + shift,
                "width": 100
            }));

        });

        // Trigger layout
        focusImgs[0].dispatchEvent(new Event("load", { "bubbles": true }));

        expect(getCorrectedWidthSpy).toHaveBeenCalledTimes(3);
        expect(onePassLayoutSpy).toHaveBeenCalledTimes(1);
        expect(resetStyleSpy).toHaveBeenCalledTimes(1);

        expect(focusImgs[0].style.height).toBe("");
        expect(focusImgs[1].style.height).toBe("");
        expect(focusImgs[2].style.height).toBe("");

    });

});
