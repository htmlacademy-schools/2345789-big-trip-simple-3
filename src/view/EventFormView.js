import dayjs from 'dayjs';
import EventView from '../view/EventView.js';
import {destinations, offersByType, getOffer} from '../mock/event.js';
import {capitalizeFirstLetter, EVENT_TYPES, getDatetime} from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const formMode = {
  NEW: 'NEW',
  EDIT: 'EDIT',
};

const createEventsFormTemplate = (defaultEvent = null) => {
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
    if (defaultEvent.offers.length === 0) {
      return `
      <li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>
    `;
    }
    const rawOffers = defaultEvent.offers;
    const offers = [];
    for (let i = 0; i < rawOffers.length; i++) {
      const offer = getOffer(rawOffers[i]);
      offers.push(`
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1"
            type="checkbox" name="event-offer-${offer.id}" checked
          >
          <label class="event__offer-label" for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
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

  let currentMode;
  if (defaultEvent) {
    currentMode = formMode.EDIT;
  } else {
    currentMode = formMode.NEW;
  }
  const getFormButtons = () => {
    if (currentMode === formMode.NEW) {
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
            type="text" name="event-start-time" value="${getDatetime(dayjs(defaultEvent.date_from))}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1"
            type="text" name="event-end-time" value="${getDatetime(dayjs(defaultEvent.date_to))}"
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

class EventFormView extends AbstractStatefulView {
  #event;
  _state;

  constructor(event) {
    super();
    this.#event = event;
    this.defaultEvent = Object.assign({}, event);
    this._state = EventFormView.parseEventToState(event);
    this.#setInnerHandlers();
  }

  static parseEventToState = (event) => ({...event,
    isDestination: event.destination !== null
  });

  static parseStateToEvent = (state) => {
    const event = {...state};

    if (!event.isDestination) {
      event.destination = null;
    }

    delete event.isDestination;

    return event;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#changeType);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#changeDestination);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#changePrice);
    this.element.querySelector('.event__available-offers')
      .addEventListener('input', this.#changeOffers);
    this.element.querySelector('#event-start-time-1')
      .addEventListener('input', this.#changeDateFrom);
    this.element.querySelector('#event-end-time-1')
      .addEventListener('input', this.#changeDateTo);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setArrowClickHandler(this._callback.closeForm);
    this.setDeleteButtonClickListener(this._callback.deleteEvent);
  };

  #changeDateTo = (evt) => {
    evt.preventDefault();
    const fieldset = this.element.querySelector('.event__field-group--time');
    const newDate = fieldset.querySelector('#event-start-time-1').value;
    // eslint-disable-next-line camelcase
    this.#event.date_to = newDate;
    this._setState({
      dateTo: newDate,
    });
  };

  #changeDateFrom = (evt) => {
    evt.preventDefault();
    const fieldset = this.element.querySelector('.event__field-group--time');
    const newDate = fieldset.querySelector('#event-end-time-1').value;
    // eslint-disable-next-line camelcase
    this.#event.date_from = newDate;
    this._setState({
      dateFrom: newDate
    });
  };

  #changeType = (evt) => {
    evt.preventDefault();
    const fieldset = this.element.querySelector('.event__type-list');
    const newType = fieldset.querySelector('input:checked').value;
    this.#event.type = newType;
    let newOffers = [];
    for (let i = 0; i < offersByType.length; i++) {
      if (offersByType[i].type === newType) {
        newOffers = offersByType[i].offers;
      }
    }

    this.#event.offers = newOffers;
    this.updateElement({
      type: newType,
      offers: newOffers,
    });
  };

  #changePrice = (evt) => {
    evt.preventDefault();
    const fieldset = this.element.querySelector('.event__field-group--price');
    const newPrice = fieldset.querySelector('#event-price-1').value;
    // eslint-disable-next-line camelcase
    this.#event.base_price = newPrice;
    this._setState({
      basePrice: newPrice,
    });
  };

  #changeOffers = (evt) => {
    evt.preventDefault();
    const offersField = this.element.querySelector('.event__available-offers');
    const checkboxes = offersField.querySelectorAll('.event__offer-checkbox:checked');

    const checkedIds = [];

    checkboxes.forEach((checkbox) => {
      checkedIds.push(checkbox.id);
    });

    this._setState({
      offers: checkedIds,
    });
  };

  #changeDestination = (evt) => {
    evt.preventDefault();
    const newDestinationName = event.target.value;
    let newDestination = null;
    Object.values(destinations).forEach((destination) => {
      if (newDestinationName === destination.name) {
        newDestination = destination;
        this.updateElement({
          destination: newDestination,
          isDestination: true,
        });
      }
    });

    this._setState({
      destination: {name: newDestinationName},
      isDestination: false,
    });
  };

  get template() {
    return createEventsFormTemplate(this.#event);
  }

  get eventView() {
    return new EventView(this.#event);
  }

  set eventView(event) {
    this.#event = event;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventFormView.parseStateToEvent(this._state));
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteButtonClickListener = (callback) => {
    this._callback.deleteEvent = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteEvent(EventFormView.parseStateToEvent(this._state));
  };

  #arrowClickHandler = (evt) => {
    evt.preventDefault();
    this.reset(this.defaultEvent);
    this._callback.closeForm();
  };

  setArrowClickHandler = (callback) => {
    this._callback.closeForm = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#arrowClickHandler);
  };


  // deleteEvent() {
  //   console.log('delete');
  //   this.delete();
  //   this.event = undefined;
  // }

  reset = (event) => {
    this.#event = event;
    this.updateElement(
      EventFormView.parseEventToState(event),
    );
  };
}

export default EventFormView;
