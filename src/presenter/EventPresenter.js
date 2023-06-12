import { render,replace,remove } from '../framework/render.js';
import EventView from '../view/EventView.js';
import EditEventView from '../view/EditEventView.js';
import {ACTIONS, UPDATE_MODES} from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class EventPresenter {
  #point = null;

  #changeData = null;
  #changeMode = null;

  #containerElement = null;
  #pointRouteView = null;
  #formEdit = null;

  #mode = Mode.DEFAULT;

  constructor (containerElement,changeData,changeMode) {
    this.#containerElement = containerElement;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point,destinations,offers) => {

    this.#point = point;

    const prevPointRouteView = this.#pointRouteView;
    const prevFormEdit = this.#formEdit;

    this.#pointRouteView = new EventView(point,destinations,offers);

    this.#formEdit = new EditEventView(point, destinations, offers);

    this.#pointRouteView.setFormOpen(this.#setFormOpen);
    this.#formEdit.setFormClose(this.#setFormCLose);
    this.#formEdit.setFormSubmit(this.#setFormSubmit);
    this.#formEdit.setFormDelete(this.#setFormDelete);

    if (prevPointRouteView === null || prevFormEdit === null) {
      render(this.#pointRouteView,this.#containerElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointRouteView,prevPointRouteView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEdit,prevFormEdit);
      this.#mode = Mode.DEFAULT;
    }
    remove(prevPointRouteView);
    remove(prevFormEdit);
  };

  destroy = () => {
    remove(this.#pointRouteView);
    remove(this.#formEdit);
  };


  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#formEdit.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#formEdit.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#formEdit.shake();
      return;
    }

    const resetFormState = () => {
      this.#formEdit.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#formEdit.shake(resetFormState);
  };

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT) {
      this.#formEdit.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#formEdit,this.#pointRouteView);
    document.addEventListener('keydown' , this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointRouteView,this.#formEdit);
    document.removeEventListener('keydown' , this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#formEdit.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #setFormOpen = () => {
    this.#replacePointToForm();
  };

  #setFormCLose = () => {
    this.#formEdit.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #setFormSubmit = (update, destinations, offersByType) => {
    this.#changeData(ACTIONS.UPDATE_POINT, UPDATE_MODES.MINOR, update, destinations, offersByType);
  };

  #setFormDelete = (point) => {
    this.#changeData(ACTIONS.DELETE_POINT, UPDATE_MODES.MINOR, point);
  };
}

export default EventPresenter;
