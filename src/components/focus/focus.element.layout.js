const HEIGHT_TRIGGER = 50,
  LAYOUT_DEBOUNCE_TIME = 200,
  SIZE_MARGIN = 0.01;

/**
 * Layout focus
 */
export class FocusElementLayout {
  constructor(focus) {
    this.focus = focus;
    this.timeout = null;
  }

  /**
   * Debounced layout
   */
  layout() {
    // Reset styles to do calculations
    if (!this.timeoutId) {
      this.resetStyles();
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.layoutInternal();
    }, LAYOUT_DEBOUNCE_TIME);
  }

  /**
   * Layout
   */
  layoutInternal() {
    // Get focus element width before layout and compute new height
    const data = this.computeNewLineHeight(),
      widthBefore = this.focus.getFocusElementBounding().width;

    // Update focus height to force scrollbar display if needed
    this.updateHeight(data);

    /*
     * Get focus element width after height update, if it change, a scroll appears and
     * shift content. In this case a new layout will be performed by resize observer
     * due to focus width update.
     */
    if (widthBefore - this.focus.getFocusElementBounding().width > 0) {
      return;
    }

    // Update DOM with computed new height
    this.updateDom(data);
  }

  /**
   * Reset styles for layout height calculation
   */
  resetStyles() {
    // Reset styles to let do flexbox layout
    this.focus.getFocusElement().classList.remove("noflex");
    this.focus.getStore().photos.forEach((photo) => {
      photo.imgPhoto.clearSize();
    });
  }

  computeNewLineHeight() {
    const linesHeight = [],
      linesPhotos = [],
      linesPhotosWidth = [],
      linesWidth = [],
      newLineHeight = [];

    let gap = 0,
      previousOffsetLeft = -1;

    // Loop on each photos to isolate lines information
    this.focus.getStore().photos.forEach((photo, index) => {
      if (previousOffsetLeft >= photo.getImgBounding().left || index === 0) {
        linesHeight.push(photo.getImgBounding().height);
        linesPhotosWidth.push(0);
        linesWidth.push(0);
        linesPhotos.push([]);
      }

      linesPhotos[linesPhotos.length - 1].push(photo);
      // Get normalized image width to avoid bad layout
      linesPhotosWidth[linesPhotosWidth.length - 1] += photo.getImageWidth();
      linesWidth[linesWidth.length - 1] += this.getCorrectedWidth(photo);

      previousOffsetLeft = photo.getImgBounding().left;
    });

    // Loop over lines to compute new height
    linesHeight.forEach((height, index) => {
      newLineHeight.push((height * linesWidth[index]) / linesPhotosWidth[index]);
    });

    // Get grid gap if there are more than one line
    if (linesPhotos.length > 1) {
      gap = linesPhotos[1][0].getImgBounding().top - linesPhotos[0][0].getImgBounding().bottom;
    }

    return {
      gap,
      lineHeight: linesHeight[0],
      linesPhotos,
      newLineHeight,
    };
  }

  /**
   * Update focus height to let scrollbar appear
   * @param {Object} data computed new line height
   * @param {*} data.newLineHeight array of new height for each lines
   * @param {*} data.lineHeight initial line height that will be used for last line
   * @param {*} data.gap grid gap
   */
  updateHeight({ newLineHeight, lineHeight, gap }) {
    const heightBefore = this.focus.getFocusElementBounding().height,
      newHeight = newLineHeight.slice(0, -1).reduce((accumulator, value) => accumulator + value + gap, lineHeight);

    /*
     * Grow focus height to force scrollbar display if needed. Reduce height only
     * if height reduction above height trigger to avoid inifinte loop. Infinite loop
     * can occurs when scrollbar disapear after height reduction and appear back
     * after next layout.
     */
    if (!heightBefore || newHeight > heightBefore || heightBefore - newHeight > HEIGHT_TRIGGER) {
      this.focus.getFocusElement().style.height = `${newHeight}px`;
    }
  }

  /**
   * Update DOM with new height
   * @param {Object} data computed new line height
   * @param {*} data.linesPhotos array of photos for each lines
   * @param {*} data.newLineHeight array of new height for each lines
   */
  updateDom({ linesPhotos, newLineHeight }) {
    // Avoids 1 pixel space between pictures on Chrome
    this.focus.getFocusElement().classList.add("noflex");

    linesPhotos.forEach((linePhotos, index, arr) => {
      // No flex for last photos line to avoid big photos on last line
      if (index !== arr.length - 1) {
        linePhotos.forEach((linePhoto) => {
          if (linePhoto.imgPhoto.width && linePhoto.imgPhoto.height) {
            // Force width to avoid bad layout if inaccurate width and height provided
            const width = (linePhoto.imgPhoto.width * newLineHeight[index]) / linePhoto.imgPhoto.height;
            linePhoto.imgPhoto.setWidth(`${width - SIZE_MARGIN}px`);
          }

          // Need some margin to avoid bad layout
          linePhoto.imgPhoto.setHeight(`${newLineHeight[index] - SIZE_MARGIN}px`);
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
    let boundingRight = photo.getBounding().right;
    if (boundingRight > this.focus.getFocusElementBounding().right) {
      boundingRight = this.focus.getFocusElementBounding().right;
    }

    return boundingRight - photo.getBounding().left;
  }
}
