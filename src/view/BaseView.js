import {createElement} from '../render';

class BaseView {
  getTemplate() {
    throw new Error('Method has not been implemented yet');
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export default BaseView;
