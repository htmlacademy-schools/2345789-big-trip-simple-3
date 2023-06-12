import AbstractView from '../framework/view/abstract-view';

function getFilterTemplate(currentFilter) {
  return `
  <form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currentFilter === 'everything' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilter === 'future' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
}

class FilterView extends AbstractView {
  #currentFilter;

  constructor(currentFilterType) {
    super();
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return getFilterTemplate(this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };

  setOnFilterTypeChange = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };
}

export default FilterView;
