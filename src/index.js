const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const config = require('./config');

// Command imports
const registerUserCommands = require('./users/commands');
// const registerStatCommands = require('./stats/commands');

// Create the bot and register all commands
const Bot = new TelegramBot(config.token, {polling: true});

registerUserCommands(Bot);
// registerStatCommands(Bot);

console.log(`Bot started at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
