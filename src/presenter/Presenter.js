import {render} from '../framework/render.js';
import SortView from '../view/SortView.js';
import {generateEvents} from '../mock/event';
import {getRandomInt} from '../utils.js';
import EmptyListView from '../view/EmptyListView.js';
import EventPresenter from '../presenter/EventPresenter.js';
import {destinations, offersList} from '../mock/event.js';

class Presenter {

  // init() {
  //   this.#renderBoard();
  // }

  constructor(container) {
    this.container = container;
    this.events = generateEvents(getRandomInt(0, 3));
    render(new SortView(), this.container);

    if (this.events.length === 0) {
      render(new EmptyListView(), this.container);
    } else {
      for (let i = 0; i < this.events.length; i++) {
        new EventPresenter(this.container, destinations, offersList).init(this.events[i]);
      }
    }
  }

  // #handleViewAction = async (actionType, updateType, update) => {
  //   switch (actionType) {
  //     case actions.UPDATE_POINT:
  //       this.#tripPointPresenter.get(update.id).setSaving();
  //       try {
  //         await this.#tripPointsModel.updatePoint(updateType, update);
  //       } catch(err) {
  //         this.#tripPointPresenter.get(update.id).setAborting();
  //       }
  //       break;
  //     case actions.ADD_POINT:
  //       this.#newPointPresenter.setSaving();
  //       try {
  //         await this.#tripPointsModel.addPoint(updateType, update);
  //       } catch(err) {
  //         this.#newPointPresenter.setAborting();
  //       }
  //       break;
  //     case actions.DELETE_POINT:
  //       this.#tripPointPresenter.get(update.id).setDeleting();
  //       try {
  //         await this.#tripPointsModel.deletePoint(updateType, update);
  //       } catch(err) {
  //         this.#tripPointPresenter.get(update.id).setAborting();
  //       }
  //       break;
  //   }
  // };
}

export default Presenter;
