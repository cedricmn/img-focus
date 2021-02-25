/**
 * @file Focus element layout logic.
 */
import { FocusElement } from "./focus.element";
import { Photo } from "../../model/photo";
const HEIGHT_TRIGGER = 50,
  LAYOUT_DEBOUNCE_TIME = 200,
  LAYOUT_DIRECT_DEBOUNCE_TIME = 4,
  SIZE_MARGIN = 0.01;

/**
 * @typedef {object} LayoutData
 * @property {number} gap - Row gap between photos.
 * @property {Photo[][]} linesPhotos - Photos on each line.
 * @property {number[]} newLineHeight - New height for each lines.
 */

/**
 * Focus element layout logic.
 */
export class FocusElementLayout {
  /**
   * Constructor.
   *
   * @param {FocusElement} focusElement - Focus element.
   */
  constructor(focusElement) {
    this.focusElement = focusElement;
    this.timeout = null;
  }

  /**
   * Debounced layout.
   *
   * @param {boolean} direct - Direct layout to reduce debounce time.
   */
  layout(direct = false) {
    // Reset styles to do calculations
    if (!this.timeoutId) {
      this.resetStyles();
    }

    let timer = LAYOUT_DEBOUNCE_TIME;
    if (direct) {
      timer = LAYOUT_DIRECT_DEBOUNCE_TIME;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.layoutInternal();
    }, timer);
  }

  /**
   * Layout internal.
   */
  layoutInternal() {
    // Get focus element width before layout and compute new height
    const data = this.computeNewLineHeight(),
      widthBefore = this.focusElement.getFocusSlotBounding().width;

    // Update focus height to force scrollbar display if needed
    this.updateHeight(data);

    /*
     * Get focus element width after height update, if it change, a scroll appears and
     * shift content. In this case a new layout will be performed by resize observer
     * due to focus width update.
     */
    if (widthBefore - this.focusElement.getFocusSlotBounding().width > 0) {
      return;
    }

    // Update DOM with computed new height
    this.updateDom(data);
  }

  /**
   * Reset styles for layout height calculation.
   */
  resetStyles() {
    // Reset styles to let do flexbox layout
    this.focusElement.getFocusSlot().classList.remove("noflex");
    this.focusElement.getStore().photos.forEach((photo) => {
      photo.photoElement.clearSize();
    });
  }

  /**
   * Compute layout data based on image size or on photo element intrinsec width provided.
   *
   * @returns {LayoutData} - Layout data.
   */
  computeNewLineHeight() {
    const linesHeight = [],
      linesPhotos = [],
      linesPhotosWidth = [],
      linesWidth = [],
      newLineHeight = [];

    let gap = 0,
      previousOffsetLeft = -1;

    // Loop on each photos to isolate lines information
    this.focusElement.getStore().photos.forEach((photo, index) => {
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
    FocusElementLayout.updateLastLineHeight(newLineHeight, linesHeight[0]);

    // Get grid gap if there are more than one line
    if (linesPhotos.length > 1) {
      gap = linesPhotos[1][0].getImgBounding().top - linesPhotos[0][0].getImgBounding().bottom;
    }

    return {
      gap,
      linesPhotos,
      newLineHeight,
    };
  }

  /**
   * Update last line height.
   *
   * @param {number[]} newLineHeight - New height for each lines.
   * @param {number} lineHeight - Initial line height.
   */
  static updateLastLineHeight(newLineHeight, lineHeight) {
    // Remove last line from computed height
    const lastLineHeight = newLineHeight.pop();
    // Initial height by default for a single line
    let newLastLineHeight = lineHeight;
    if (newLineHeight.length >= 1) {
      // Compute mean height
      const meanLineHeight =
        newLineHeight.reduce((accumulator, value) => accumulator + value, 0) / newLineHeight.length;

      // Use mean or computed height to get consistent last line height
      newLastLineHeight = Math.min(meanLineHeight, lastLineHeight);
    }
    newLineHeight.push(newLastLineHeight);
  }

  /**
   * Update focus height to let scrollbar appear.
   *
   * @param {LayoutData} data - Layout data.
   */
  updateHeight({ newLineHeight, gap }) {
    const heightBefore = this.focusElement.getFocusSlotBounding().height,
      newHeight = newLineHeight.reduce((accumulator, value) => accumulator + value + gap, -gap);

    /*
     * Grow focus height to force scrollbar display if needed. Reduce height only
     * if height reduction above height trigger to avoid inifinte loop. Infinite loop
     * can occurs when scrollbar disapear after height reduction and appear back
     * after next layout.
     */
    if (!heightBefore || newHeight > heightBefore || heightBefore - newHeight > HEIGHT_TRIGGER) {
      this.focusElement.getFocusSlot().style.height = `${newHeight}px`;
    }
  }

  /**
   * Update DOM with new height.
   *
   * @param {LayoutData} data - Layout data.
   */
  updateDom({ linesPhotos, newLineHeight }) {
    // Avoids 1 pixel space between pictures on Chrome
    this.focusElement.getFocusSlot().classList.add("noflex");

    linesPhotos.forEach((linePhotos, index) => {
      // Need some margin to avoid bad layout
      const photoHeight = newLineHeight[index] - SIZE_MARGIN;

      linePhotos.forEach((linePhoto) => {
        if (linePhoto.photoElement.width && linePhoto.photoElement.height) {
          // Force width to avoid bad layout if inaccurate width and height provided
          const width = (linePhoto.photoElement.width * photoHeight) / linePhoto.photoElement.height;
          linePhoto.photoElement.setWidth(`${width - SIZE_MARGIN}px`);
        }

        linePhoto.photoElement.setHeight(`${photoHeight}px`);
      });
    });
  }

  /**
   * Get corrected width of photo element.
   * Chrome sometimes returns bigger photo element right position than focus element.
   *
   * @param {Photo} photo - Photo.
   * @returns {number} Corrected width.
   */
  getCorrectedWidth(photo) {
    // Ignore photo bigger than focus (occurs in Chrome)
    let boundingRight = photo.getBounding().right;
    if (boundingRight > this.focusElement.getFocusSlotBounding().right) {
      boundingRight = this.focusElement.getFocusSlotBounding().right;
    }

    return boundingRight - photo.getBounding().left;
  }
}
