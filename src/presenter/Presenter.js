import {render} from '../framework/render.js';
import SortView from '../view/SortView.js';
import {generateEvents} from '../mock/event';
import {getRandomInt} from '../utils.js';
import EmptyListView from '../view/EmptyListView.js';
import EventPresenter from '../presenter/EventPresenter.js';
import {destinations, offersList} from '../mock/event.js';

class Presenter {
  init(container) {
    this.container = container;
    this.events = generateEvents(getRandomInt(0, 3));
    render(new SortView(), this.container);

    this.eventPresenters = [];
    if (this.events.length === 0) {
      render(new EmptyListView(), this.container);
    } else {
      for (let i = 0; i < this.events.length; i++) {
        new EventPresenter(this.container, destinations, offersList).init(this.events[i]);
      }
    }
  }
}

export default Presenter;
