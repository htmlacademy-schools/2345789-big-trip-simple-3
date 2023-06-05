import {render} from './framework/render.js';
import Presenter from './presenter/Presenter.js';
import FilterView from './view/FilterView.js';

const tripFiltersSection = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const presenter = new Presenter();

render(new FilterView(), tripFiltersSection);
presenter.init(tripEventsSection);
