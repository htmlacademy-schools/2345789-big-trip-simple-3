import {render} from './framework/render.js';
import {getAuthorizationKey} from './utils.js';
import EventAPIService from './api/EventAPIService.js';
import EventModel from './model/EventModel.js';
import FilterModel from './model/FilterModel.js';
import FilterPresenter from './presenter/FilterPresenter.js';
import Presenter from './presenter/Presenter.js';
import AddEventButtonView from './view/AddEventButtonView.js';

const AUTHORIZATION = `Basic ${getAuthorizationKey(10)}`;
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
const tripPointsApiService = new EventAPIService(END_POINT, AUTHORIZATION);

const formAddButtonComponent = new AddEventButtonView();
const formAddButtonContainer = document.querySelector('.trip-main');

const containerFilterPlace = document.querySelector('.trip-controls__filters');
const containerPlace = document.querySelector('.trip-events');

const pointModel = new EventModel(tripPointsApiService);
const filterModel = new FilterModel();

const presenter = new Presenter(containerPlace, pointModel, filterModel);
const filterPresenter = new FilterPresenter(containerFilterPlace, filterModel, pointModel);

const onAddPointFormClose = () => {
  formAddButtonComponent.element.disabled = false;
};

const onAddPointButtonClick = () => {
  presenter.createTripPoint(onAddPointFormClose);
  formAddButtonComponent.element.disabled = true;
};

render(formAddButtonComponent, formAddButtonContainer);
formAddButtonComponent.setOnAddPointButtonClick(onAddPointButtonClick);

filterPresenter.init();
presenter.init();

pointModel.init().finally(() => {
  render(formAddButtonComponent, formAddButtonContainer);
  formAddButtonComponent.setOnAddPointButtonClick(onAddPointButtonClick);
});
