import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {capitalizeFirstLetter, getDatetime, isOfferChecked} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import dayjs from 'dayjs';

const createPictureTemplate = (pictures) => pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}"></img>`).join('');

const createOffersTemplate = (offers,offersByType,type,isDisabled) => {
  const offersByCurrentType = offersByType.find((element) => element.type === type).offers;
  return offersByCurrentType.map(({ id, title, price }) =>
    `<div class="event__offer-selector" ${isDisabled ? 'disabled' : ''}>
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" data-offer-id="${id}" ${isOfferChecked(offers, id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${title}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  ).join('');
};

const createNameTemplate = (destinations, isDisabled) => destinations.map((element) => `<option value="${element.name}" ${isDisabled ? 'disabled' : ''}></option>`).join('');


const createTypeTemplate = (offersByType,type,isDisabled) => {
  const pointTypes = offersByType.map((element) => element.type);

  return pointTypes.map((pointType) =>
    `<div class="event__type-item" ${isDisabled ? 'disabled' : ''}>
      <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType}</label>
    </div>`
  ).join('');
};

const createFormEditTemplate = (point,destinations,offersByType) => {
  const {basePrice,dateFrom,dateTo,destination,type,offers,isDisabled, isSaving, isDeleting} = point;
  const currentDestination = destinations.find((element) => element.id === destination);

  const dataFromDisplay = getDatetime(dayjs(dateFrom));
  const dataToDisplay = getDatetime(dayjs(dateTo));
  return (
    ` <li class="trip-events__item ">
<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createTypeTemplate(offersByType,type, isDisabled)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${capitalizeFirstLetter(he.encode(currentDestination.name))}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createNameTemplate(destinations, isDisabled)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dataFromDisplay}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dataToDisplay}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" max="9999999"  name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
      </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersTemplate(offers,offersByType,type, isDisabled)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictureTemplate(currentDestination.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li> `
  );
};

class EditEventView extends AbstractStatefulView {
  #dateFromPicker = null;
  #dateToPicker = null;

  #destinations = null;
  #offersByType = null;

  constructor (point,destinations,offersByType) {
    super();
    this._state = EditEventView.parsePointToState(point);
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditTemplate(this._state,this.#destinations,this.#offersByType);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }
    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  reset = (point) => {
    this.updateElement (
      EditEventView.parsePointToState(point)
    );
  };

  #dueDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dueDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker = () => {

    this.#dateFromPicker = flatpickr(this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dueDateFromChangeHandler
      });
    this.#dateToPicker = flatpickr(this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dueDateToChangeHandler,
      });
  };

  setFormClose = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };

  setFormSubmit = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (getDatetime(dayjs(this._state.dateFrom)) > getDatetime(dayjs(this._state.dateTo))) {
      this.shake();
      return;
    }
    this._callback.formSubmit(EditEventView.parseStateToPoint(this._state),this.#destinations,this.#offersByType );
  };

  #setInnerHandlers = () => {
    this.element.addEventListener('change', this.#onOfferChange);
    this.element.addEventListener('change', this.#onEventTypeChange);
    this.element.addEventListener('change', this.#onDestinationChange);
    this.element.addEventListener('change', this.#onPriceChange);
  };

  #onOfferChange = (evt) => {
    if (!evt.target.closest('input[type="checkbox"].event__offer-checkbox')) {
      return;
    }

    evt.preventDefault();
    const checkedOffers = [...this._state.offers];
    if (evt.target.checked) {
      checkedOffers.push(Number(evt.target.dataset.offerId));
    } else {
      const idIndex = checkedOffers.indexOf(Number(evt.target.dataset.offerId));
      checkedOffers.splice(idIndex, 1);
    }

    this.updateElement({
      offers: checkedOffers
    });
  };

  #onEventTypeChange = (evt) => {
    if (!evt.target.closest('input[type="radio"].event__type-input')) {
      return;
    }

    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #onDestinationChange = (evt) => {
    if (!evt.target.closest('input[type="text"].event__input--destination')) {
      return;
    }

    evt.preventDefault();
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value).id;
    this.updateElement({
      destination: newDestination
    });
  };

  setFormDelete = (callback) => {
    this._callback.formDelete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onDeletePointButtonClick);
  };

  #onPriceChange = (evt) => {
    if (!evt.target.closest('input[type="number"].event__input--price')) {
      return;
    }

    evt.preventDefault();
    this.updateElement({
      basePrice: evt.target.value
    });
  };

  #onDeletePointButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.formDelete(EditEventView.parseStateToPoint(this._state));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmit(this._callback.formSubmit);
    this.setFormClose(this._callback.formClose);
    this.setFormDelete(this._callback.formDelete);
    this.#setDatepicker();
  };

  static parsePointToState = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };
}

export default EditEventView;
