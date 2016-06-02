const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const config = require('./config');

// Command imports
const registerStatCommands = require('./stats/commands');
const registerUserCommands = require('./users/commands');

// Create the bot and register all commands
const Bot = new TelegramBot(config.token);

registerStatCommands(Bot);
registerUserCommands(Bot);

console.log(`Bot started at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
