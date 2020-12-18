const FIREFOX_HEIGHT_MARGIN = 0.01;

/**
 * Layout focus
 */
export class FocusElementLayout {

    constructor(focus) {

        this.focus = focus;

    }

    /**
     * Do photo layout
     */
    layout() {

        // Reset styles to do calculations
        this.resetStyles();

        // Get focus element width before layout
        const widthBefore = this.focus.getFocusElementBounding().width;

        // Do first layout
        this.onePassLayout();

        /*
         * Get focus element width after layout, if it change, a scroll appears and
         * shift content. In this case do a second pass layout with corrected width.
         */
        if (widthBefore - this.focus.getFocusElementBounding().width > 0) {

            this.focus.getFocusElement().style.width = `${this.focus.getFocusElementBounding().width}px`;
            this.resetStyles();
            this.onePassLayout();
            this.focus.getFocusElement().style.width = "";

        }

    }

    /**
     * Reset styles for layout height calculation
     */
    resetStyles() {

        // Reset styles to let do flexbox layout
        this.focus.getFocusElement().classList.remove("noflex");
        this.focus.getStore().photos.forEach((photo) => {

            photo.imgPhoto.setHeight("");

        });

    }

    /**
     * Do a single pass layout
     */
    onePassLayout() {

        // Compute new height
        const data = this.computeNewLineHeight();

        // Update DOM with computed new height
        this.updateDom(data.linesPhotos, data.newLineHeight);

    }

    computeNewLineHeight() {

        const linesHeight = [],
            linesPhotos = [],
            linesPhotosWidth = [],
            linesWidth = [],
            newLineHeight = [];

        let previousOffsetLeft = -1;

        // Loop on each photos to isolate lines information
        this.focus.getStore().photos.forEach((photo, index) => {

            if (previousOffsetLeft >= photo.getImgBounding().left || index === 0) {

                linesHeight.push(photo.getImgBounding().height);
                linesPhotosWidth.push(0);
                linesWidth.push(0);
                linesPhotos.push([]);

            }

            linesPhotos[linesPhotos.length - 1].push(photo);
            linesPhotosWidth[linesPhotosWidth.length - 1] += photo.getImgBounding().width;
            linesWidth[linesWidth.length - 1] += this.getCorrectedWidth(photo);

            previousOffsetLeft = photo.getImgBounding().left;

        });

        // Loop over lines to compute new height
        linesHeight.forEach((height, index) => {

            newLineHeight.push(height * linesWidth[index] / linesPhotosWidth[index]);

        });

        return {
            linesPhotos,
            newLineHeight
        };

    }

    /**
     * Update DOM with new height
     * @param {*} linesPhotos array of photos for each lines
     * @param {*} newLineHeight array of new height for each lines
     */
    updateDom(linesPhotos, newLineHeight) {

        // Avoids 1 pixel space between pictures on Chrome
        this.focus.getFocusElement().classList.add("noflex");

        linesPhotos.forEach((linePhotos, index, arr) => {

            // No flex for last photos line to avoid big photos on last line
            if (index !== arr.length - 1) {

                linePhotos.forEach((linePhoto) => {

                    // Firefox need some margin to avoid bad layout
                    linePhoto.imgPhoto.setHeight(`${newLineHeight[index] - FIREFOX_HEIGHT_MARGIN}px`);

                });

            }

        });

    }

    /**
     * Get corrected width of flexbox element
     * Chrome sometimes returns bigger photo element right position than focus element
     * @param {*} photo photo
     */
    getCorrectedWidth(photo) {

        // Ignore photo bigger than focus (occurs in Chrome)
        let { right } = photo.getBounding();
        if (right > this.focus.getFocusElementBounding().width) {

            right = this.focus.getFocusElementBounding().width;

        }

        return right - photo.getBounding().left;

    }

}
