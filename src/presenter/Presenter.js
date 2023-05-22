import {render} from '../render.js';
import EventView from '../view/EventView.js';
import SortView from '../view/SortView.js';
import AddEventView from '../view/AddEventView.js';
import EditEventView from '../view/EditEventView.js';
import EventListView from '../view/EventListView.js';

class Presenter {
  eventListComponent = new EventListView();
  init(container) {
    this.container = container;
    render(new EditEventView(), this.container);
    render(new SortView(), this.container);
    render(this.eventListComponent, this.container);
    for (let i = 0; i < 3; i++) {
      this.eventListComponent.addItem(new EventView());
    }
    render(new AddEventView(), this.container);
  }
}

export default Presenter;
