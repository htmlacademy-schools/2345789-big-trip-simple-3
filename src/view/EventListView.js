import AbstractView from '../framework/view/abstract-view.js';

const POINT_TEMPLATE = '<ul class="trip-events__list"></ul>';

class EventListView extends AbstractView {
  get template() {
    return POINT_TEMPLATE;
  }
}

export default EventListView;
