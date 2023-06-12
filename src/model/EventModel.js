import {UPDATE_MODES} from '../utils.js';
import Observable from '../framework/observable.js';

class EventModel extends Observable{
  #eventAPIService;
  #points = [];
  #destinations = [];
  #offersByType = [];

  constructor (eventAPIService) {
    super();
    this.#eventAPIService = eventAPIService;
  }

  init = async () => {
    try {
      const points = await this.#eventAPIService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    try {
      this.#destinations = await this.#eventAPIService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    try {
      this.#offersByType = await this.#eventAPIService.offersByType;
    } catch(err) {
      this.#offersByType = [];
    }

    this._notify(UPDATE_MODES.INIT);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#eventAPIService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    const response = await this.#eventAPIService.updatePoint(update);
    try {
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#eventAPIService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  };

  get points () {
    return this.#points;
  }

  get offersByType () {
    return this.#offersByType;
  }

  get destinations () {
    return this.#destinations;
  }
}

export default EventModel;
