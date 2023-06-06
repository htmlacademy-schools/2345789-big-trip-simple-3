import {render, replace, remove} from '../framework/render.js';
import EventView from '../view/EventView.js';
import EventFormView from '../view/EventFormView.js';

const formState = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

class EventPresenter {
  static allInstances = [];
  #pointComponent;
  #pointEditorComponent;

  #event;
  #state = formState.DEFAULT;
  #container;
  #availableDestinations;
  #availableOffers;

  constructor(container, destinations, offers) {
    this.#container = container;
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
    this.#pointEditorComponent.setCancelButtonClickHandler();

    if (prevPointComponent === undefined || prevPointEditorComponent === undefined) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#state === formState.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#state === formState.EDIT) {
      replace(this.#pointComponent, prevPointEditorComponent);
      this.#state = formState.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditorComponent);
  }

  setSaving = () => {
    if (this.#state === formState.EDIT) {
      this.#pointEditorComponent.updateElement({
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#state === formState.EDIT) {
      this.#pointEditorComponent.updateElement({
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#state === formState.DEFAULT) {
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
    replace(this.#pointComponent, this.#pointEditorComponent);
    this.#state = formState.DEFAULT;
  };

  #replacePointToForm = () => {
    this.#state = formState.EDIT;
    for (let i = 0; i < EventPresenter.allInstances.length; i++) {
      if(EventPresenter.allInstances[i] !== this) {
        this.resetView(EventPresenter.allInstances[i]);
      }
    }
    replace(this.#pointEditorComponent, this.#pointComponent);
  };

  #handleFormSubmit = () => {
    throw new Error('Not yet implemented');
  };

  destroy = () => {
    remove(this.#pointEditorComponent);
    remove(this.#pointComponent);
  };

  resetView = (form) => {
    if (form.#state !== formState.DEFAULT) {
      form.#replaceFormToPoint();
    }
  };
}

export default EventPresenter;
