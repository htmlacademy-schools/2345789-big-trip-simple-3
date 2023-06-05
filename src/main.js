import {render} from './framework/render.js';
import Presenter from './presenter/Presenter.js';
import FilterView from './view/FilterView.js';

const filtersSection = document.querySelector('.trip-controls__filters');
const eventsSection = document.querySelector('.trip-events');
const presenter = new Presenter();

render(new FilterView(), filtersSection);
presenter.init(eventsSection);
