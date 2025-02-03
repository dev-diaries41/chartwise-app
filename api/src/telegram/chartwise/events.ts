import TelegramBot from "node-telegram-bot-api"
import { logger } from "@src/logger";
import { EventHandler, WebhookHandlers } from "@src/types";
import { getFullSizePhoto } from "@src/utils/telegram";
import { BotErrors } from "../errors";
import { CHART_RECEIVED_MESSAGE, HELP_MESSAGE, UPLOAD_CHART_MESSAGE } from "./messages";


export function getEventHandlers(bot: TelegramBot): EventHandler[]{
    return [
        { event: 'message', handler: (message: TelegramBot.Message) => handleMessage(message, bot) },
        { event: 'polling_error', handler: (error: Error) => handlePollingError(error) }
    ];
}

export const webhookHandlers: WebhookHandlers = {
    handleMessage,
    handleInlineQuery,
    handleChosenInlineResult,
    handleCallbackQuery
}


async function handleMessage(message: TelegramBot.Message, bot: TelegramBot): Promise<void> {
    try {
        if(message.photo){
            await handlePhoto(message, bot);
            return
        }
        
        switch (message.text) {
            case '/start':
                await bot.sendMessage(message.chat.id, `${HELP_MESSAGE}\n\n${UPLOAD_CHART_MESSAGE}`);
                break;
            case '/help':
                await bot.sendMessage(message.chat.id, HELP_MESSAGE);
                break;
            case  '/analyse':
                await bot.sendMessage(message.chat.id, UPLOAD_CHART_MESSAGE);
                break;
            default:
                break;
        }
    } catch (error: any) {
        logger.error(`${BotErrors.MESSAGE_PROCESSING_ERROR}: ${error.message}`)
        bot.sendMessage(message.chat.id, BotErrors.MESSAGE_PROCESSING_ERROR);
    }
}


async function handlePhoto(message: TelegramBot.Message, bot: TelegramBot): Promise<void>{
    try {
        if(!message.photo)throw new Error(BotErrors.MISSING_PHOTO_ERROR);
        await bot.sendMessage(message.chat.id, CHART_RECEIVED_MESSAGE);
        const largestPhoto = getFullSizePhoto(message.photo)
        const photoUrl = await bot.getFileLink(largestPhoto.file_id);
        await bot.sendMessage(message.chat.id, photoUrl);
    } catch (error: any) {
        logger.error(`${BotErrors.PHOTO_UPLOAD_ERROR}: ${error.message}`)
        bot.sendMessage(message.chat.id, BotErrors.PHOTO_UPLOAD_ERROR);
    }
}

async function handleDocument(message: TelegramBot.Message, bot: TelegramBot): Promise<void>{
    try {
    } catch (error: any) {
        logger.error(`${BotErrors.DOCUMENT_UPLOAD_ERROR}: ${error.message}`)
        bot.sendMessage(message.chat.id, BotErrors.DOCUMENT_UPLOAD_ERROR);
    }
}

async function handleVoice(message: TelegramBot.Message, bot: TelegramBot): Promise<void>{
    try {
    } catch (error: any) {
        logger.error(`${BotErrors.VOICE_MESSAGE_ERROR}: ${error.message}`)
        bot.sendMessage(message.chat.id, BotErrors.VOICE_MESSAGE_ERROR);
    }
}

async function handleInlineQuery(inlineQuery: TelegramBot.InlineQuery, bot: TelegramBot): Promise<void> {
    try {
        console.log(`Received inline query from ${inlineQuery.from.id}`);
    } catch (error: any) {
        logger.error(`${BotErrors.INLINE_QUERY_ERROR}: ${error.message}`)
    }
  }

async function handleChosenInlineResult(chosenInlineResult: TelegramBot.ChosenInlineResult, bot: TelegramBot): Promise<void> {
    try {
        console.log(`Received chosen inline result from ${chosenInlineResult.from.id}`);
    } catch (error: any) {
        logger.error(`${BotErrors.INLINE_QUERY_ERROR}: ${error.message}`)
    }
}

async function handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery, bot: TelegramBot): Promise<void> {
    try {
        console.log(`Received callback query from ${callbackQuery.from.id}`);
    } catch (error: any) {
        logger.error(`${BotErrors.CALLBACK_QUERY_ERROR}: ${error.message}`)
    }
}

async function handlePollingError(error: Error) {
    console.error(`Error occurred: ${error.message}`);
}