import {remove, render, RenderPosition } from '../framework/render.js';
import EventPresenter from './EventPresenter.js';
import EventListView from '../view/EventListView.js';
import EmptyListView from '../view/EmptyListView.js';
import SortView from '../view/SortView.js';
import NewEventPresenter from './NewEventPresenter.js';
import {SORT_MODE, ACTIONS, UPDATE_MODES, FILTER_MODE, filter, sortByPrice, sortByDay} from '../utils.js';
import LoadingView from '../view/LoadingView.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class Presenter {
  #emptyList;
  #sort;
  #eventList = new EventListView();
  #loadingComponent = new LoadingView();

  #containerElement;
  #pointModel;
  #filterModel;

  #pointPresenter = new Map();
  #addPointPresenter;

  #currentSortType = SORT_MODE.DAY;
  #filterType = FILTER_MODE.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor (containerElement,pointModel,filterModel) {
    this.#containerElement = containerElement;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#addPointPresenter = new NewEventPresenter(this.#eventList.element, this.#onViewAction);

    this.#pointModel.addObserver(this.#onModelPoint);
    this.#filterModel.addObserver(this.#onModelPoint);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SORT_MODE.DAY:
        return filteredPoints.sort(sortByDay);
      case SORT_MODE.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init = () => {
    this.#renderTripPoints();
  };

  createTripPoint = (callback) => {
    this.#currentSortType = SORT_MODE.DAY;
    if (this.#emptyList) {
      this.#filterModel.updateFilter(UPDATE_MODES.MAJOR, FILTER_MODE.EVERYTHING);
      remove(this.#emptyList);
    } else {
      this.#filterModel.updateFilter(UPDATE_MODES.MAJOR, FILTER_MODE.EVERYTHING);
    }
    this.#addPointPresenter.init(this.#pointModel.destinations, this.#pointModel.offersByType, callback);
  };

  #onViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case ACTIONS.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case ACTIONS.ADD_POINT:
        this.#addPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          // console.log(err); // debug
          this.#addPointPresenter.setAborting();
        }
        break;
      case ACTIONS.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          // console.log(err); // debug
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case ACTIONS.CLOSE_FORM:
        if (this.#emptyList) {
          this.#clearPointList();
          this.#renderTripPoints();
        }
    }
    this.#uiBlocker.unblock();
  };

  #onModelPoint = (updateType, data) => {
    switch (updateType) {
      case UPDATE_MODES.PATCH:
        this.#pointPresenter.get(data.id).init(data,this.#pointModel.destinations, this.#pointModel.offersByType);
        break;
      case UPDATE_MODES.MINOR:
        this.#clearPointList();
        this.#renderTripPoints();
        break;
      case UPDATE_MODES.MAJOR:
        this.#clearPointList({resetSortingType: true});
        this.#renderTripPoints();
        break;
      case UPDATE_MODES.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTripPoints();
        break;
    }
  };

  #onModeChange = () => {
    this.#addPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripPoints();
  };

  #renderPoint = (pointRoute) => {
    const eventPresenter = new EventPresenter(this.#eventList.element,this.#onViewAction,this.#onModeChange);
    eventPresenter.init(pointRoute,this.#pointModel.destinations,this.#pointModel.offersByType);
    this.#pointPresenter.set(pointRoute.id, eventPresenter);
  };

  #renderEmptyList = () => {
    this.#emptyList = new EmptyListView(this.#filterType);
    render(this.#emptyList, this.#containerElement);
  };

  #renderLoadingMessage = () => {
    render(this.#loadingComponent, this.#containerElement, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sort = new SortView(this.#currentSortType);
    this.#sort.setSortTypeChangeHandler(this.#onSortTypeChange);
    render(this.#sort, this.#containerElement, RenderPosition.AFTERBEGIN);
  };

  #rednerFormList = () => {
    render(this.#eventList , this.#containerElement);
  };

  #renderTripPoints = () => {
    this.#rednerFormList();
    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }
    if (this.points.length === 0) {
      this.#renderEmptyList();
    }

    this.#renderSort();
    this.#rednerFormList();

    this.points.forEach((point) => this.#renderPoint(point, this.#pointModel.destinations, this.#pointModel.offersByType));
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#addPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sort);
    remove(this.#loadingComponent);

    if (this.#emptyList) {
      remove(this.#emptyList);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_MODE.DAY;
    }
  };
}

