import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_MODE} from '../utils.js';

const EmptyListMessageTextType = {
  [FILTER_MODE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_MODE.FUTURE]: 'There are no future events now',
};

const createEmptyListMessageTemplate = (filterType) => {
  const EmptyListMessageTextValue = EmptyListMessageTextType[filterType];
  return (`<p class="trip-events__msg">${EmptyListMessageTextValue}</p>`);
};

class EmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createEmptyListMessageTemplate(this.#filterType);
  }
}

export default EmptyListView;
