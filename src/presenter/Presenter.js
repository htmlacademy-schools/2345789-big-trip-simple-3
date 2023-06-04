import {render} from '../render.js';
import EventView from '../view/EventView.js';
import SortView from '../view/SortView.js';
import {generateEvents} from '../mock/event';
import {getRandomInt} from '../utils.js';

class Presenter {
  init(container) {
    this.container = container;
    this.events = generateEvents(getRandomInt(1, 3));
    this.eventViews = this.events.map((data) => new EventView(data));
    render(new SortView(), this.container);
    for (let i = 0; i < this.eventViews.length; i++) {
      render(this.eventViews[i], this.container);
    }
  }
}

export default Presenter;
