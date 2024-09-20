import TelegramBot from "node-telegram-bot-api";

export  interface EventHandler {
  event: string;
  handler: (args: any) => void;
}

export interface WebhookHandlers {
    handleMessage(message: TelegramBot.Message, bot: TelegramBot): Promise<void>;
    handleInlineQuery(inlineQuery: TelegramBot.InlineQuery, bot: TelegramBot): Promise<void>
    handleChosenInlineResult(chosenInlineResult: TelegramBot.ChosenInlineResult, bot: TelegramBot): Promise<void>
    handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery, bot: TelegramBot): Promise<void>
  }