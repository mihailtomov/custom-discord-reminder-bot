import { addLeadingZero } from './utils.js';

const daysOfWeek = [
  { name: 'Monday', value: 'mon' },
  { name: 'Tuesday', value: 'tue' },
  { name: 'Wednesday', value: 'wed' },
  { name: 'Thursday', value: 'thu' },
  { name: 'Friday', value: 'fri' },
  { name: 'Saturday', value: 'sat' },
  { name: 'Sunday', value: 'sun' },
];

const hourOptions = new Array(24).fill({}).map((_, index) => ({
  name: `${addLeadingZero(index.toString())}:00`,
  value: index.toString(),
}));

export { daysOfWeek, hourOptions };
