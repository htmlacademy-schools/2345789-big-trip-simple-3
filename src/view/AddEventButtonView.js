import AbstractView from '../framework/view/abstract-view';

const NEW_EVENT_BUTTON_TEMPLATE = `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
 `;

class AddEventButtonView extends AbstractView {
  get template() {
    return NEW_EVENT_BUTTON_TEMPLATE;
  }

  setOnAddPointButtonClick = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onAddPointButtonClick);
  };

  #onAddPointButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

export default AddEventButtonView;
