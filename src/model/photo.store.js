export class PhotoStore {
  constructor() {
    this.imgPhotoMap = new Map();
    this.photosInner = [];
    this.current = null;
  }

  /**
   * Add photo in store
   * @param {*} photo photo
   */
  add(photo) {
    this.photosInner.push(photo);
    this.imgPhotoMap.set(photo.imgPhoto, photo);
  }

  /**
   * Insert photo after a given photo
   * @param {*} photo photo to insert
   * @param {*} previousPhoto previous photo
   */
  insert(photo, previousPhoto) {
    this.photosInner.splice(this.photosInner.indexOf(previousPhoto) + 1, 0, photo);
    this.imgPhotoMap.set(photo.imgPhoto, photo);
  }

  /**
   * Select current photo
   * @param {*} photo photo to select
   */
  select(photo) {
    this.current = photo;
  }

  /**
   * Navigate to previous photo
   * @returns {*} previous photo
   */
  prev() {
    const index = this.photosInner.indexOf(this.current);
    if (index === 0) {
      return null;
    }
    this.current = this.photosInner[index - 1];
    return this.current;
  }

  /**
   * Navigate to next photo
   * @returns {*} next photo
   */
  next() {
    const index = this.photosInner.indexOf(this.current);
    if (index === this.photosInner.length - 1) {
      return null;
    }
    this.current = this.photosInner[index + 1];
    return this.current;
  }

  /**
   * Get photo from img element
   * @param {*} imgPhoto img element
   */
  get(imgPhoto) {
    return this.imgPhotoMap.get(imgPhoto);
  }

  /**
   * Get photos
   */
  get photos() {
    return this.photosInner;
  }
}
