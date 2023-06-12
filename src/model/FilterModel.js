import { FILTER_MODE } from '../utils.js';
import Observable from '../framework/observable';

export default class FilterModel extends Observable {
  #filter = FILTER_MODE.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  set filter(value) {
    this.#filter = value;
    this._notify();
  }

  updateFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
