export class Photo {

    /**
     * Constructor
     *
     * @param {*} imgPhoto image photo element
     * @param {*} div image surrounding div element
     * @param {*} img image element
     */
    constructor(imgPhoto, div, img) {

        this.imgPhotoInner = imgPhoto;
        this.divInner = div;
        this.imgInner = img;

    }

    /**
     * Get image photo element
     */
    get imgPhoto() {

        return this.imgPhotoInner;

    }

    /**
     * Get image surrounding div element
     */
    get div() {

        return this.divInner;

    }

    /**
     * Get image element
     */
    get img() {

        return this.imgInner;

    }

    /**
     * Get image bounding
     */
    getImgBounding() {

        return this.imgInner.getBoundingClientRect();

    }

    /**
     * Get surrounding div bounding
     */
    getDivBounding() {

        return this.divInner.getBoundingClientRect();

    }

}
