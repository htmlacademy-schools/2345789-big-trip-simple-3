import {render} from '../framework/render.js';
import SortView from '../view/SortView.js';
import {generateEvents} from '../mock/event';
import {getRandomInt, actions} from '../utils.js';
import EmptyListView from '../view/EmptyListView.js';
import EventPresenter from '../presenter/EventPresenter.js';
import {destinations, offersList} from '../mock/event.js';

class Presenter {
  #emptyListComponent;
  #isLoading = true;
  #pointSorter;
  #tripPointPresenter = new Map();
  #newPointPresenter;
  #tripPointsModel;

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

  // #renderEmptyList = (isError = false) => {
  //   this.#emptyListComponent = new EmptyListView(this.#filterType, isError);
  //   render(this.#emptyListComponent, this.#container);
  // };

  get points() {
    // switch (this.#sortType) {
    //   case SortType.DAY:
    //     return filteredPoints.sort(sortDays);
    //   case SortType.PRICE:
    //     return filteredPoints.sort(sortPrices);
    // }

    return this.events;
  }

  #renderPoint = (point) => {
    const offers = point.offers;
    const tripPointPresenter = new EventPresenter(this.container, this.#handleViewAction, destinations, offers);
    tripPointPresenter.init(point);
    this.#tripPointPresenter.set(point.id, tripPointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  // #renderLoading = () => {
  //   render(this.#loadingComponent, this.#tripPointsList.element, RenderPosition.AFTERBEGIN);
  // };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case actions.UPDATE_POINT:
        this.#tripPointPresenter.get(update.id).setSaving();
        try {
          await this.#tripPointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      case actions.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#tripPointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case actions.DELETE_POINT:
        this.#tripPointPresenter.get(update.id).setDeleting();
        try {
          await this.#tripPointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = () => {
    // switch (updateType) {
    //   case UpdateType.PATCH:
    //     this.#tripPointPresenter.get(data.id).init(data);
    //     break;
    //   case UpdateType.MINOR:
    //     this.#clearPointList();
    //     this.#renderPoints();
    //     break;
    //   case UpdateType.MAJOR:
    //     this.#clearPointList({resetSortType: true});
    //     this.#renderPoints();
    //     break;
    //   case UpdateType.INIT:
    //     this.#isLoading = false;
    //     this.#renderPoints();
    //     break;
    //   case UpdateType.ERROR:
    //     this.#isLoading = false;
    //     break;
    // }
    throw new Error('Yet to implement');
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  // #renderSort = () => {
  //   this.#pointSorter = new PointListSortingView(this.#sortType);
  //   this.#pointSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);
  //
  //   render(this.#pointSorter, this.#container, RenderPosition.AFTERBEGIN);
  // };
  //
  // #handleSortTypeChange = (sortType) => {
  //   if (this.#sortType === sortType) {
  //     return;
  //   }
  //
  //   this.#sortType = sortType;
  //   this.#clearPointList();
  //   this.#renderBoard();
  // };
}

export default Presenter;
