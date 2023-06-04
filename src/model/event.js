import {EVENT_TYPES} from '../utils.js';

class EventModel {
  event = {};

  constructor(type, destination, dateFrom, dateTo, basePrice, offers = undefined) {
    this.event.type = type;
    this.event.destination = destination;
    // eslint-disable-next-line camelcase
    this.event.date_from = dateFrom;
    // eslint-disable-next-line camelcase
    this.event.date_to = dateTo;
    // eslint-disable-next-line camelcase
    this.event.base_price = basePrice;
    if (offers) {
      this.event.offers = offers;
    }
  }

  getEvent() {
    return this.event;
  }

  setType(type) {
    if (type in EVENT_TYPES) {
      this.event.type = type;
    } else {
      throw new Error('Invalid type');
    }
  }

  setDestination(destination) {
    this.event.destination = destination;
  }

  setDateFrom(dateFrom) {
    // eslint-disable-next-line camelcase
    this.event.date_from = dateFrom;
  }

  setDateTo(dateTo) {
    // eslint-disable-next-line camelcase
    this.event.date_to = dateTo;
  }

  setBasePrice(basePrice) {
    // eslint-disable-next-line camelcase
    this.event.base_price = basePrice;
  }

  setOffer(offer) {
    this.event.offer = offer;
  }
}

export default EventModel;
