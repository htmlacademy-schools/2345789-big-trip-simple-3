import AbstractView from '../framework/view/abstract-view.js';

const LOADING_TEMPLATE = '<p class="trip-events__msg">Loading...</p>';

class LoadingView extends AbstractView {
  get template() {
    return LOADING_TEMPLATE;
  }
}

export default LoadingView;
