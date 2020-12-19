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
}
