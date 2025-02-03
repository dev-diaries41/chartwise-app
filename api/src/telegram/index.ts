import TelegramBot from 'node-telegram-bot-api';
import { EventHandler, WebhookHandlers } from '../types';
import dotenv from 'dotenv';
dotenv.config();


export const BotConfig: {token: string, opts: {polling?: boolean}} = {
  token: process.env.TELEGRAM_BOT_TOKEN || '',
  opts: {polling: true},
} as const


export class Bot extends TelegramBot {
  
  constructor(config: {token: string, options: TelegramBot.ConstructorOptions}, slashCommands: {
    command: string;
    description: string;
}[]) {
    super(config.token, config.options);
    this.setupSlashCommands(slashCommands);
  }

  private setupSlashCommands(slashCommands: TelegramBot.BotCommand[]) {
    this.setMyCommands(slashCommands).then(() => {
      console.log('Slash commands set successfully!');
    }).catch((err) => {
      console.error('Error setting slash commands:', err);
    });
  }

  public handleEvents(eventHandlers: EventHandler[]) {
    eventHandlers.forEach(({ event, handler }) => {
        this.on(event, handler);
    });
    console.log('Bot listening...');
}

  public async handleWebhookUpdate(update: TelegramBot.Update, webhookHandler: WebhookHandlers) {
    try {
      if (update.message) {
        await webhookHandler.handleMessage(update.message, this);
      } else if (update.inline_query) {
        await webhookHandler.handleInlineQuery(update.inline_query, this);
      } else if (update.chosen_inline_result) {
        await webhookHandler.handleChosenInlineResult(update.chosen_inline_result, this);
      } else if (update.callback_query) {
        await webhookHandler.handleCallbackQuery(update.callback_query, this);
      }
    } catch (err) {
      console.error('Error handling webhook update:', err);
    }
  }
}
