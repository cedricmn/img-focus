import "../../index.js";
import { UtilTest } from "../../../test/utiltest.js";

describe("img-zoom test", () => {

    it("with empty sloted content", async () => {

        expect.assertions(3);

        const { zoomSlot } = await UtilTest.initZoom(document);

        expect(zoomSlot).toBeDefined();
        expect(zoomSlot.assignedNodes()).toBeDefined();
        expect(zoomSlot.assignedNodes()).toHaveLength(0);

    });

    it("with non-image sloted content", async () => {

        expect.assertions(3);

        const paragraph = document.createElement("p");
        paragraph.append("A paragraph");

        const { zoomSlot } = await UtilTest.initZoom(document, paragraph);

        expect(zoomSlot).toBeDefined();
        expect(zoomSlot.assignedNodes()).toBeDefined();
        expect(zoomSlot.assignedNodes()).toHaveLength(1);

    });

    it("with one image sloted content", async () => {

        expect.assertions(3);

        const img = document.createElement("img");
        img.srcset = "focus.png 320w";
        img.size = "100vw";

        const { zoomSlot } = await UtilTest.initZoom(document, img);

        expect(zoomSlot).not.toBeNull();
        expect(zoomSlot.assignedNodes()).toHaveLength(1);
        expect(zoomSlot.assignedNodes()[0].srcset).toStrictEqual("focus.png 320w");

    });

});
