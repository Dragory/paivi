const dbModelSetup = require('./dbModelSetup');
dbModelSetup();

const TelegramBot = require('node-telegram-bot-api');
const wrapBotInQueue = require('./wrapper/wrapper');
const moment = require('moment');
const config = require('./config');

// Command imports
const registerUserCommands = require('./users/commands');
const registerMessageLogCommands = require('./messageLog/commands');
const registerPresenceCommands = require('./presence/commands');

const registerStatCommands = require('./stats/commands');
const registerGenerateCommands = require('./generate/commands');

// Create the bot and register all commands
const bot = wrapBotInQueue(new TelegramBot(config.token, {polling: true}));

registerUserCommands(bot);
registerMessageLogCommands(bot);
registerPresenceCommands(bot);

registerStatCommands(bot);
registerGenerateCommands(bot);

console.log(`Bot started at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
