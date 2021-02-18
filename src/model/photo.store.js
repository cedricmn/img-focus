/**
 * @file Photo store containing all photos sloted in focus element.
 */

import { Photo } from "./photo";
import { PhotoElement } from "../components/photo/photo.element";

/**
 * Photo store.
 */
export class PhotoStore {
  /**
   * Constructor.
   */
  constructor() {
    this.photoMap = new Map();
    this.photosInner = [];
    this.current = null;
  }

  /**
   * Add photo in store.
   *
   * @param {Photo} photo - Photo.
   */
  add(photo) {
    this.photosInner.push(photo);
    this.photoMap.set(photo.photoElement, photo);
  }

  /**
   * Insert photo after a given photo.
   *
   * @param {Photo} photo - Photo to insert.
   * @param {PhotoElement} previousPhoto - Previous photo element.
   */
  insert(photo, previousPhoto) {
    this.photosInner.splice(this.photosInner.indexOf(previousPhoto) + 1, 0, photo);
    this.photoMap.set(photo.photoElement, photo);
  }

  /**
   * Select current photo.
   *
   * @param {Photo} photo - Photo to select.
   */
  select(photo) {
    this.current = photo;
  }

  /**
   * Get current photo.
   *
   * @returns {Photo} Current photo.
   */
  getCurrent() {
    return this.current;
  }

  /**
   * Navigate to previous photo.
   *
   * @returns {Photo} Previous photo.
   */
  prev() {
    const prevPhoto = this.getPrev(this.current);
    if (prevPhoto !== null) {
      this.current = prevPhoto;
    }
    return prevPhoto;
  }

  /**
   * Has previous photo.
   *
   * @param {Photo} photo - Photo to check previous.
   * @returns {boolean} True if photo has previous photo.
   */
  hasPrev(photo) {
    return this.getPrev(photo) !== null;
  }

  /**
   * Get previous photo.
   *
   * @param {Photo} photo - Photo to get previous.
   * @returns {Photo} Previous photo.
   */
  getPrev(photo) {
    const index = this.photosInner.indexOf(photo);
    if (index === 0) {
      return null;
    }
    return this.photosInner[index - 1];
  }

  /**
   * Navigate to next photo.
   *
   * @returns {Photo} Next photo.
   */
  next() {
    const nextPhoto = this.getNext(this.current);
    if (nextPhoto !== null) {
      this.current = nextPhoto;
    }
    return nextPhoto;
  }

  /**
   * Has next photo.
   *
   * @param {Photo} photo - Photo to check next.
   * @returns {boolean} True if photo has next photo.
   */
  hasNext(photo) {
    return this.getNext(photo) !== null;
  }

  /**
   * Get next photo.
   *
   * @param {Photo} photo - Photo to get next.
   * @returns {Photo} Next photo.
   */
  getNext(photo) {
    const index = this.photosInner.indexOf(photo);
    if (index === this.photosInner.length - 1) {
      return null;
    }
    return this.photosInner[index + 1];
  }

  /**
   * Get photo from photo element.
   *
   * @param {PhotoElement} photoElement - Photo element.
   * @returns {Photo} Photo.
   */
  get(photoElement) {
    return this.photoMap.get(photoElement);
  }

  /**
   * Get photos.
   *
   * @returns {Photo[]} Photos elements.
   */
  get photos() {
    return this.photosInner;
  }
}
