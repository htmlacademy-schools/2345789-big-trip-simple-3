import dayjs from 'dayjs';
import BaseView from './BaseView.js';
import {destinations, getOffer} from '../mock/event.js';
import {capitalizeFirstLetter, getDate, getHumanDate, getDatetime, getHumanTime} from '../utils.js';

const createTripEventTemplate = (event) => {
  const dateTo = dayjs(event.dateTo);
  const dateFrom = dayjs(event.dateFrom);
  let destination;
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i].id === event.destination) {
      destination = destinations[i];
    }
  }

  const getTripTypeIconSrc = () => `img/icons/${event.type}.png`;
  const getTripEventTitle = () => `${capitalizeFirstLetter(event.type)} ${destination.name}`;

  const listActiveOffers = () => {
    if (!event.offers) {
      return `
      <li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>
    `;
    }
    const rawOffers = [];
    for (let i = 0; i < event.offers.length; i++) {
      rawOffers.push(getOffer(event.offers[i]));
    }

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

  return `
    <div class="event">
      <time class="event__date" datetime="${getDate(dateFrom)}">${getHumanDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${getTripTypeIconSrc()}" alt="Event type icon">
      </div>
      <h3 class="event__title">${getTripEventTitle()}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDatetime(dateFrom)}">${getHumanTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${getDatetime(dateTo)}">${getHumanTime(dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${event.base_price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${listActiveOffers()}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  `;
};

class EventView extends BaseView {
  constructor(event) {
    super();
    this.event = event;

    this._arrow = this.getElement().querySelector('.event__rollup-btn');
    this._arrow.addEventListener('click', this.onArrowClick);
  }

  getTemplate() {
    return createTripEventTemplate(this.event);
  }
}

export default EventView;