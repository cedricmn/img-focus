/**
 * @file Photo.
 */

import { PhotoElement } from "../components/photo/photo.element";

/**
 * Photo.
 */
export class Photo {
  /**
   * Photo constructor.
   *
   * @param {PhotoElement} photoElement - Photo element.
   */
  constructor(photoElement) {
    this.photoElementInner = photoElement;
  }

  /**
   * Get photo element.
   *
   * @returns {PhotoElement} Photo element.
   */
  get photoElement() {
    return this.photoElementInner;
  }

  /**
   * Get image bounding.
   *
   * @returns {DOMRect} Image element bounding.
   */
  getImgBounding() {
    return this.photoElementInner.getImg().getBoundingClientRect();
  }

  /**
   * Get bounding.
   *
   * @returns {DOMRect} Photo element bounding.
   */
  getBounding() {
    return this.photoElementInner.getBoundingClientRect();
  }

  /**
   * Get normalized image width.
   *
   * @returns {number} Image width.
   */
  getImageWidth() {
    if (this.photoElement.width && this.photoElement.height) {
      // Normalize to have consistent layout before and after image load
      return (this.photoElement.width * this.getImgBounding().height) / this.photoElement.height;
    }
    return this.getImgBounding().width;
  }
}
