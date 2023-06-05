import AbstractView from '../framework/view/abstract-view.js';
import {createElement, render} from '../render.js';

const EVENT_LIST_TEMPLATE = `
<ul class="trip-events__list"></ul>
`;

const EVENT_ITEM_TEMPLATE = `
<li class="trip-events__item"></li>
`;

const EMPTY_LIST_TEMPLATE = `
<p class="trip-events__msg">Click New Event to create your first point</p>
`;

class EventListView extends AbstractView {
  #filtersForm = document.querySelector('.trip-filters');
  _filterValue = this.#filtersForm.querySelector('input[name="trip-filter"]:checked').value;

  initList() {
    if (!this.isEmpty()) {
      this.events.forEach((component) => {
        this._appendComponent(component);
      });
    } else {
      this.updateMessage();
    }
  }

  afterCreateElement() {
    this.initList();
  }

  isEmpty() {
    return this.events.length === 0;
  }

  get template() {
    if (this.isEmpty()) {
      return EMPTY_LIST_TEMPLATE;
    } else {
      return EVENT_LIST_TEMPLATE;
    }
  }

  constructor(events) {
    super();
    this.events = events || [];

    this.setFiltersFormChangeHandler((evt) => {
      if (evt.target.name === 'trip-filter') {
        this.filterValue = evt.target.value;
        this.updateMessage();
      }
    });
  }

  #filtersFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.filtersFormChange(evt);
  };

  setFiltersFormChangeHandler = (callback) => {
    this._callback.filtersFormChange = callback;
    this.#filtersForm.addEventListener('change', this.#filtersFormHandler);
  };

  updateMessage() {
    if (this.isEmpty()) {
      let newText = 'Click New Event to create your first point'; // default value
      if (this._filterValue === 'future') {
        newText = 'There are no future events now';
      } else if (this._filterValue === 'past') {
        newText = 'There are no past events now';
      }

      this.element.innerText = newText;
    }
  }

  addComponent(component) {
    // add new component to this View and show it
    this.tripEvents.push(component);
    if (this.isEmpty()) {
      this.removeElement();
      // eslint-disable-next-line no-unused-expressions
      this.element;
    } else {
      this._appendComponent(component);
    }
  }

  _appendComponent(component) {
    const listElement = createElement(EVENT_ITEM_TEMPLATE);
    render(component, listElement);
    this.element.append(listElement);
  }
}

export default EventListView;
