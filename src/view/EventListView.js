import BaseView from './BaseView.js';
import {createElement, render} from '../render.js';

const EVENT_LIST_TEMPLATE = `
<ul class="trip-events__list"></ul>
`;

const EVENT_ITEM_TEMPLATE = `
<li class="trip-events__item"></li>
`;

class EventListView extends BaseView {
  getTemplate() {
    return EVENT_LIST_TEMPLATE;
  }

  addItem(component) {
    const item = createElement(EVENT_ITEM_TEMPLATE);
    render(component, item);
    this.getElement().append(item);
  }
}

export default EventListView;
