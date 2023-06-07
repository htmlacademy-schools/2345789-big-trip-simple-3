import {render, replace, remove} from '../framework/render.js';
import EventView from '../view/EventView.js';
import EventFormView from '../view/EventFormView.js';

const formMode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

class EventPresenter {
  static allInstances = [];
  #pointComponent;
  #pointEditorComponent;

  #event;
  #mode = formMode.DEFAULT;
  #container;
  #availableDestinations;
  #availableOffers;
  #changeData;

  constructor(container, changeData, destinations, offers) {
    this.#container = container;
    this.#changeData = changeData;
    this.#availableDestinations = destinations;
    this.#availableOffers = offers;
    EventPresenter.allInstances.push(this);
  }

  init(event) {
    this.#event = event;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditorComponent = this.#pointEditorComponent;

    this.#pointComponent = new EventView(this.#event);
    this.#pointEditorComponent = new EventFormView(this.#event);

    this.#pointComponent.setArrowClickHandler(this.#replacePointToForm);
    this.#pointEditorComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditorComponent.setArrowClickHandler(this.#replaceFormToPoint);
    this.#pointEditorComponent.setDeleteButtonClickListener(this.#handleDeleteClick);

    if (prevPointComponent === undefined || prevPointEditorComponent === undefined) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === formMode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === formMode.EDIT) {
      replace(this.#pointComponent, prevPointEditorComponent);
      this.#mode = formMode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditorComponent);
  }

  setSaving = () => {
    if (this.#mode === formMode.EDIT) {
      this.#pointEditorComponent.updateElement({
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === formMode.EDIT) {
      this.#pointEditorComponent.updateElement({
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === formMode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditorComponent.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditorComponent.shake(resetFormState);
  };

  #replaceFormToPoint = () => {
    // this.#pointEditorComponent.reset(this.#event);
    replace(this.#pointComponent, this.#pointEditorComponent);
    this.#mode = formMode.DEFAULT;
  };

  #handleDeleteClick = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditorComponent);
  };

  #replacePointToForm = () => {
    this.#mode = formMode.EDIT;
    for (let i = 0; i < EventPresenter.allInstances.length; i++) {
      if(EventPresenter.allInstances[i] !== this) {
        this.resetView(EventPresenter.allInstances[i]);
      }
    }
    replace(this.#pointEditorComponent, this.#pointComponent);
  };

  #handleFormSubmit = () => {
    throw new Error('Hasn\'t been implemented yet');
  };

  destroy = () => {
    remove(this.#pointEditorComponent);
    remove(this.#pointComponent);
  };

  resetView = (form) => {
    if (form.#mode !== formMode.DEFAULT) {
      // this.#pointEditorComponent.reset(this.#event);
      form.#replaceFormToPoint();
    }
  };
}

export default EventPresenter;
