import {EVENT_TYPES} from '../utils.js';

class EventModel {
  event = {};

  constructor(type, destination, dateFrom, dateTo, basePrice, offers = undefined) {
    if (EVENT_TYPES.includes(type)) {
      this.event.type = type;
    } else {
      throw new Error('Invalid type.');
    }
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

  get getEvent() {
    return this.event;
  }
}

export default EventModel;
