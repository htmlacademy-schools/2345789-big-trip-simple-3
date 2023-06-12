import {capitalizeFirstLetter, getHumanDate, isOfferChecked} from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';

const date = dayjs().$d;
const POINT_BLANK = {
  basePrice: 0,
  dateFrom:date,
  dateTo: date,
  destination: 1,
  id: null,
  type: 'taxi',
  offers: [],
};

function getPictureTemplate(pictures) {
  return pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}"></img>`).join('');
}


function getOffersTemplate(type, offers, offersByType,isDisabled) {
  const pointByType = offersByType.find((element) => element.type === type).offers;

  return pointByType.map(( {id, title, price}) =>
    `<div class="event__offer-selector" ${isDisabled ? 'disabled' : ''}>
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" data-offer-id="${id}" ${isOfferChecked(offers, id) ? 'checked' : ''}>
  <label class="event__offer-label" for="event-offer-${title}-1">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`
  ).join('');
}

function getNameTemplate(destinations, isDisabled) {
  return destinations.map((element) => `<option value="${element.name}" ${isDisabled ? 'disabled' : ''}></option>`).join('');
}

function getTypeTemplate(offersByType,type,isDisabled) {
  const pointTypes = offersByType.map((element) => element.type);

  return pointTypes.map((pointType) =>
    `<div class="event__type-item" ${isDisabled ? 'disabled' : ''}>
      <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${capitalizeFirstLetter(pointType)}</label>
    </div>`
  ).join('');
}

function getFormEditTemplate(point, destinations, offersByType) {
  const { basePrice, dateFrom, dateTo, destination, type, offers, isDisabled, isSaving} = point;
  const currentDestination = destinations.find((element) => element.id === destination);

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
          ${getTypeTemplate(offersByType, type, isDisabled)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${capitalizeFirstLetter(he.encode(currentDestination.name))}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${getNameTemplate(destinations, isDisabled)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getHumanDate(dayjs(dateFrom))}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getHumanDate(dayjs(dateTo))}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" max="9999999"  name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
      <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${getOffersTemplate(type, offers, offersByType, isDisabled)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${getPictureTemplate(currentDestination.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li> `
  );
}

class AddEventView extends AbstractStatefulView {
  #dateFromPicker = null;
  #dateToPicker = null;

  #destinations = null;
  #offersByType = null;

  constructor (point = POINT_BLANK,destinations,offersByType) {
    super();
    this._state = AddEventView.parsePointToState(point);
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    this.#setInnerHandlers();
    this.#setDatePickers();
  }

  get template() {
    return getFormEditTemplate(this._state,this.#destinations,this.#offersByType);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setOnSubmitPointForm(this._callback.submitPointForm);
    this.setOnCancelPointButtonClick(this._callback.cancelClick);
    this.setOnClosePointButtonClick(this._callback.closeClick);

    this.#setDatePickers();
  };

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker || this.#dateToPicker) {
      this.#dateFromPicker.destroy();
      this.#dateToPicker.destroy();
      this.#dateFromPicker = null;
      this.#dateToPicker = null;
    }
  };

  setOnSubmitPointForm = (callback) => {
    this._callback.submitPointForm = callback;
    this.element.querySelector('form').addEventListener('submit', this.#onSubmitPointForm);
  };

  #onSubmitPointForm = (evt) => {
    evt.preventDefault();
    if (this._state.dateFrom > this._state.dateTo) {
      this.shake();
      return;
    }
    this._callback.submitPointForm(AddEventView.parseStateToPoint(this._state), this.#destinations, this.#offersByType);
  };

  setOnCancelPointButtonClick = (callback) => {
    this._callback.cancelClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onCancelPointButtonClick);
  };

  setOnClosePointButtonClick = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClosePointButtonClick);
  };

  #setInnerHandlers = () => {
    this.element.addEventListener('change', this.#onOfferChange);
    this.element.addEventListener('change', this.#onPointTypeChange);
    this.element.addEventListener('change', this.#onDestinationChange);
    this.element.addEventListener('change', this.#onPriceChange);
  };

  #setDatePickers = () => {
    this.#dateFromPicker = flatpickr(this.element.querySelectorAll('.event__input--time')[0], {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#onDateFromChange
    });
    this.#dateToPicker = flatpickr(this.element.querySelectorAll('.event__input--time')[1], {
      enableTime: true,
      dateFormat: 'd/m/y  H:i',
      defaultDate: this._state.dateTo,
      onChange: this.#onDateToChange,
    });
  };

  #onCancelPointButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.cancelClick();
  };

  #onClosePointButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
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

  #onPointTypeChange = (evt) => {
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

    let optionFound = false;
    const datalist = evt.target.list;
    for (let i = 0; i < datalist.options.length; i++) {
      if (evt.target.value === datalist.options[i].value) {
        optionFound = true;
        break;
      }
    }

    if (optionFound) {
      evt.target.setCustomValidity('');
    } else {
      evt.target.setCustomValidity('Please select a destination from list');
    }

    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value).id;
    this.updateElement({
      destination: newDestination
    });
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

  #onDateFromChange = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #onDateToChange = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  static parsePointToState = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;

    return point;
  };
}

export default AddEventView;
