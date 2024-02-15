import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import { daysOfWeek, hourOptions } from './config.js';

// Set a recurring reminder
const REMINDER_COMMAND = {
  name: 'reminder',
  description:
    'command to set a recurring reminder message and post it to the channel',
  type: 1,
  options: [
    {
      type: 3,
      name: 'day',
      description: 'Choose the day of the week on which to send a reminder:',
      required: true,
      choices: daysOfWeek,
    },
    {
      type: 3,
      name: 'hour',
      description: 'Choose at what hour to send the reminder:',
      required: true,
      choices: hourOptions,
    },
    {
      type: 4,
      name: 'minute',
      description:
        'Type the minute as a number from 0 to 59 at which to receive the reminder:',
      required: true,
      min_value: 0,
      max_value: 59,
    },
    {
      type: 3,
      name: 'message',
      description: 'Type a message to be sent along with the reminder:',
      required: true,
    },
  ],
};

// Remove the recurring reminder
const STOP_REMINDER_COMMAND = {
  name: 'stop-reminder',
  description:
    'command to stop the recurring message that is posted to the channel',
  type: 1,
};

const ALL_COMMANDS = [REMINDER_COMMAND, STOP_REMINDER_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
