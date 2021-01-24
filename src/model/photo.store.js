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
   * Get current photo
   * @returns {*} current photo
   */
  getCurrent() {
    return this.current;
  }

  /**
   * Navigate to previous photo
   * @returns {*} previous photo
   */
  prev() {
    const prevPhoto = this.getPrev(this.current);
    if (prevPhoto !== null) {
      this.current = prevPhoto;
    }
    return prevPhoto;
  }

  /**
   * Has previous photo
   * @param {*} photo photo to check previous
   * @returns {*} true if photo has previous photo
   */
  hasPrev(photo) {
    return this.getPrev(photo) !== null;
  }

  /**
   * Get previous photo
   * @param {*} photo photo to get previous
   * @returns {*} previous photo
   */
  getPrev(photo) {
    const index = this.photosInner.indexOf(photo);
    if (index === 0) {
      return null;
    }
    return this.photosInner[index - 1];
  }

  /**
   * Navigate to next photo
   * @returns {*} next photo
   */
  next() {
    const nextPhoto = this.getNext(this.current);
    if (nextPhoto !== null) {
      this.current = nextPhoto;
    }
    return nextPhoto;
  }

  /**
   * Has next photo
   * @param {*} photo photo to check next
   * @returns {*} true if photo has next photo
   */
  hasNext(photo) {
    return this.getNext(photo) !== null;
  }

  /**
   * Get next photo
   * @param {*} photo photo to get next
   * @returns {*} next photo
   */
  getNext(photo) {
    const index = this.photosInner.indexOf(photo);
    if (index === this.photosInner.length - 1) {
      return null;
    }
    return this.photosInner[index + 1];
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
