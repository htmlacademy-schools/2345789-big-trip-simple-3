import BaseView from './BaseView.js';

const EMPTY_LIST_TEMPLATE = `
<p class="trip-events__msg">Click New Event to create your first point</p>
`;

class EmptyListView extends BaseView {
  get getTemplate() {
    return EMPTY_LIST_TEMPLATE;
  }
}

export default EmptyListView;
