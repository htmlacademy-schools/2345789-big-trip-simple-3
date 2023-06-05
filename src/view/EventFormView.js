import dayjs from 'dayjs';
import EventView from '../view/EventView.js';
import {destinations, offersByType} from '../mock/event.js';
import {capitalizeFirstLetter, EVENT_TYPES, getDatetime} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const formState = {
  NEW: 'NEW',
  EDIT: 'EDIT',
};

const createEventsFormTemplate = (defaultEvent = null) => {
  if (!defaultEvent) {
    const date = dayjs().startOf('day').toISOString();
    const defaultType = 'flight';
    let availableOffers = [];
    for (let i = 0; i < offersByType.length; i++) {
      if (offersByType[i].type === defaultType) {
        availableOffers = offersByType[i].offers;
      }
    }
    defaultEvent = {
      id: 0,
      // eslint-disable-next-line camelcase
      base_price: null,
      // eslint-disable-next-line camelcase
      date_from: date,
      // eslint-disable-next-line camelcase
      date_to: date,
      destination: Object.keys(destinations)[0],
      type: defaultType,
      offers: availableOffers
    };
  }
  const dateFrom = dayjs(defaultEvent.date_from);
  const dateTo = dayjs(defaultEvent.date_to);
  const destination = destinations[defaultEvent.destination];

  const getTripTypeIconSrc = () => `img/icons/${defaultEvent.type}.png`;

  const getPrice = () => (defaultEvent.base_price === null) ? '' : defaultEvent.base_price;

  const listTripEventTypes = () => EVENT_TYPES.map((eventType) => `
        <div class="event__type-item">
          <input id="event-type-${eventType}-1" class="event__type-input
            visually-hidden" type="radio" name="event-type" value="${eventType}"
          >
          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">
            ${capitalizeFirstLetter(eventType)}
          </label>
        </div>
      `)
    .join('');

  const listDestinations = () => Object.values(destinations).map((d) => `
        <option value="${d.name}"></option>
      `)
    .join('');

  const listOffers = () => {
    if (!defaultEvent.offers) {
      return `
      <li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>
    `;
    }
    const rawOffers = defaultEvent.offers;
    const offers = [];
    for (let i = 0; i < rawOffers.length; i++) {
      const offer = rawOffers[i];
      offers.push(`
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `);
    }
    if (offers.length) {
      return offers.join('');
    }
  };

  const listDestinationPictures = () => destination.pictures.map((picture) => `
        <img class="event__photo" src="${picture.src}" alt="${picture.description}">
      `)
    .join('');

  let currentState;
  if (defaultEvent) {
    currentState = formState.EDIT;
  } else {
    currentState = formState.NEW;
  }
  const getFormButtons = () => {
    if (currentState === formState.NEW) {
      return `
         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">Cancel</button>
       `;
    } else {
      return `
         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">Delete</button>
         <button class="event__rollup-btn" type="button">
       `;
    }
  };

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${getTripTypeIconSrc()}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${listTripEventTypes()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalizeFirstLetter(defaultEvent.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${listDestinations()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1"
            type="text" name="event-start-time" value="${getDatetime(dateFrom)}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1"
            type="text" name="event-end-time" value="${getDatetime(dateTo)}"
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1"
            type="text" name="event-price" value="${getPrice()}"
          >
        </div>

        ${getFormButtons()}

      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${listOffers()}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${listDestinationPictures()}
            </div>
          </div>
        </section>
      </section>
    </form>
  `;
};

class EventFormView extends AbstractView {
  #event = null;
  _state = formState.NEW;

  constructor(data) {
    super();
    this.#event = data;
    this.isActive = true;

    if (this.#event) {
      this._state = formState.EDIT;
    } else {
      this._state = formState.NEW;
    }

    if (this._state === formState.NEW) {
      this.setCancelButtonClickHandler(() => this.deleteForm());
    } else {
      this.setCancelButtonClickHandler(() => this.deleteEvent());
      this.setArrowClickHandler(() => this.cancelForm());
    }

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        if (this.isActive) {
          this.isActive = false;
          this.cancelForm();
        }
      }
    });
  }

  get template() {
    return createEventsFormTemplate();
  }

  get event() {
    return new EventView(this.#event);
  }

  set event(event) {
    this.#event = event;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  #cancelButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancelButtonClick();
  };

  setCancelButtonClickHandler = (callback) => {
    this._callback.cancelButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelButtonHandler);
  };

  #arrowClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.arrowClick();
  };

  setArrowClickHandler = (callback) => {
    this._callback.arrowClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#arrowClickHandler);
  };

  _closeForm() {
    if (this.isActive) {
      this.isActive = false;
      this.element.replaceWith(this.event.element);
    }
  }

  cancelForm() {
    this._closeForm();
    this.element.reset();
  }

  deleteForm() {
    this.delete();
  }

  deleteEvent() {
    this.event.delete();
    this.delete();
  }
}

export default EventFormView;
