import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

class EventAPIService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  addPoint = async (point) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deletePoint = async (point) => await this._load({
    url: `points/${point.id}`,
    method: Method.DELETE,
  });

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom,
      'date_to': point.dateTo
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;

    return adaptedPoint;
  };
}

export default EventAPIService;
