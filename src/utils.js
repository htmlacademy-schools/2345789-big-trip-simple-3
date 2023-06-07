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

export const actions = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
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

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'm');

