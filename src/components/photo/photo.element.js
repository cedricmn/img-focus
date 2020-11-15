export class PhotoElement extends HTMLElement {

    get srcset() {

        return this.getAttribute("srcset");

    }

    set srcset(srcset) {

        this.setAttribute("srcset", srcset);

    }

}
