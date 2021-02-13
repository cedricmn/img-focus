export class Photo {
  /**
   * Constructor
   *
   * @param {*} imgPhoto image photo element
   */
  constructor(imgPhoto) {
    this.imgPhotoInner = imgPhoto;
  }

  /**
   * Get image photo element
   */
  get imgPhoto() {
    return this.imgPhotoInner;
  }

  /**
   * Get image bounding
   */
  getImgBounding() {
    return this.imgPhotoInner.getImg().getBoundingClientRect();
  }

  /**
   * Get bounding
   */
  getBounding() {
    return this.imgPhotoInner.getBoundingClientRect();
  }

  /**
   * Get normalized image width
   */
  getImageWidth() {
    if (this.imgPhoto.width && this.imgPhoto.height) {
      // Normalize to have consistent layout before and after image load
      return (this.imgPhoto.width * this.getImgBounding().height) / this.imgPhoto.height;
    }
    return this.getImgBounding().width;
  }
}
