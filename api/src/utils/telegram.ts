import TelegramBot, { PhotoSize, ReplyKeyboardMarkup } from "node-telegram-bot-api";

export function createInlineQueryResults(results: { title: string; description: string }[]): TelegramBot.InlineQueryResult[] {
    if (!results || results.length === 0) {
      return [];
    }
  
    return results.map((result, index) => ({
      type: 'article',
      id: `result_${index}`,
      title: result.title,
      input_message_content: {
        message_text: result.description,
      },
    }));
  }
  
  export function createInlineButtons(buttons: { text: string; callbackData: string }[]): TelegramBot.InlineKeyboardButton[][] {
    if (!buttons || buttons.length === 0) {
      return [];
    }
  
    return buttons.map((button) => [
      {
        text: button.text,
        callback_data: button.callbackData,
      },
    ]);
  }
  
  export function createCustomKeyboard(keyboard: string[][], options: { resize_keyboard?: boolean; one_time_keyboard?: boolean } = {}): ReplyKeyboardMarkup {
    return {
      keyboard: keyboard.map(row => row.map(text => ({ text }))),
      resize_keyboard: options.resize_keyboard?? true,
      one_time_keyboard: options.one_time_keyboard?? false
    };
  }

  export function getFullSizePhoto(photos: PhotoSize[]): PhotoSize{
    return photos.reduce((largest, current) => {
      return (largest.file_size || 0) >= (current.file_size || 0) ? largest : current;
    });
  }