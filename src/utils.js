import dayjs from 'dayjs';

export const EVENT_TYPES = [
  'check-in',
  'sightseeing',
  'restaurant',
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight'
];

export const FILTER_MODE = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

export const UPDATE_MODES = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export const ACTIONS = {
  UPDATE_POINT: 'UPDATE_EVENT',
  ADD_POINT: 'ADD_EVENT',
  DELETE_POINT: 'DELETE_EVENT',
  CLOSE_FORM: 'CLOSE_FORM',
};

export const SORT_MODE = {
  DAY: 'day',
  PRICE: 'price'
};

export function getRandomInt(minInt, maxInt) {
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export function getLoremIpsumSentences(numberOfSentences) {
  if (numberOfSentences > 11) {
    throw new Error('Invalid number of sentences. Have to be in range 1-11.');
  }
  const sample = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
    'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. ' +
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ' +
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, ' +
    'eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ' +
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. ' +
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const sampleSentences = sample.split('.');
  return `${sampleSentences.slice(0, numberOfSentences).join('.')}.`;
}

export function getRandomElementFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getDate = (date) => date.format('YYYY-MM-DD');

export const getHumanDate = (date) => date.format('MMM D').toUpperCase();

export const getDatetime = (date) => date.format('YYYY-MM-DDTHH:mm');

export const getHumanTime = (date) => date.format('HH:mm');

export const isEventFuture = (dueDate) => dayjs(dueDate).isAfter(dayjs(), 'D') || dayjs(dueDate).isSame(dayjs(), 'D');

export const getAuthorizationKey = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const filter = {
  [FILTER_MODE.EVERYTHING]: (points) => points,
  [FILTER_MODE.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dateFrom)),
};

export const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const isOfferChecked = (offers, id) => offers.includes(id);

