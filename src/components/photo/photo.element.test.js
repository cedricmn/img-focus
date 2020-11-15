import "../../index.js";

describe("img-photo test", () => {

    it("with no attributes", async () => {

        expect.assertions(1);

        const imgPhoto = document.createElement("img-photo");

        document.body.appendChild(imgPhoto);

        await window.customElements.whenDefined("img-photo");

        expect(imgPhoto.srcset).toBeNull();

    });

});
