import 'dotenv/config';
import fetch from 'node-fetch';
import express from 'express';
import { CronJob } from 'cron';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { sendMessageToChannel, addLeadingZero } from './utils.js';
import { daysOfWeek } from './config.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */

const cronJobsDict = [];

app.get('/', (req, res) => {
  console.log('Successful self-ping. Self-pinging every 14th minute.');
  res.status(200).end();
});

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    // Interaction type and data
    const { type, data, channel_id } = req.body;

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // Handle setting a reminder job
      if (name === 'reminder') {
        const [day, hour, minute, message] = req.body.data.options;

        const runningJob = new CronJob(
          `0 ${minute.value} ${hour.value} * * ${day.value}`, // cronTime
          () => sendMessageToChannel(channel_id, message.value),
          null, // onComplete
          true, // start
          'Europe/Sofia' // timeZone, hardcoded for now
        );
        // job.start() is optional here because of the fourth parameter set to true.

        // Push the job rererence to an array linked to the current channel id
        cronJobsDict.push({ channel_id, runningJob });

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Recurring reminder set! A recurring reminder will be sent to this channel every ${
              daysOfWeek.find((o) => o.value === day.value).name
            } at ${addLeadingZero(hour.value)}:${addLeadingZero(
              minute.value
            )} with the following message: "${message.value}"`,
          },
        });
      }

      // Handle removing a running reminder job on the current discord channel
      if (name === 'stop-reminder') {
        cronJobsDict
          .find((dict) => dict.channel_id === channel_id)
          ?.runningJob.stop();

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Recurring reminder successfully cancelled.',
          },
        });
      }
    }
  }
);

// start a self-pinging job to prevent the service from sleeping
const selfPingJob = new CronJob(
  '0 */14 * * * *', // send a request every 14th minute
  () => fetch('https://custom-discord-reminder-bot.onrender.com/'),
  null, // onComplete
  true, // start
  'Europe/Sofia' // timeZone, hardcoded for now
);

// add a discord server reminder job on startup
const reminderJob = new CronJob(
  '0 0 17 * * sun', // cronTime
  () =>
    sendMessageToChannel(
      process.env.SECRET_CHANNEL_ID,
      process.env.SECRET_MESSAGE
    ),
  null, // onComplete
  true, // start
  'Europe/Sofia' // timeZone, hardcoded for now
);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
