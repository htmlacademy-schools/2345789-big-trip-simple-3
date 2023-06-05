import AbstractView from '../framework/view/abstract-view.js';

const EMPTY_LIST_TEMPLATE = `
<p class="trip-events__msg">Click New Event to create your first point</p>
`;

class EmptyListView extends AbstractView {
  get template() {
    return EMPTY_LIST_TEMPLATE;
  }
}

export default EmptyListView;
