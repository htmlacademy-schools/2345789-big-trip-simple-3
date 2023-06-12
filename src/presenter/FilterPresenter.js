import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/FilterView.js';
import {UPDATE_MODES} from '../utils.js';

class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #tripEventsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, tripEventsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#tripEventsModel = tripEventsModel;

    this.#tripEventsModel.addObserver(this.#onModelPoint);
    this.#filterModel.addObserver(this.#onModelPoint);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.#filterModel.filter);
    this.#filterComponent.setOnFilterTypeChange(this.#onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #onModelPoint = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.updateFilter(UPDATE_MODES.MAJOR, filterType);
  };
}

export default FilterPresenter;
