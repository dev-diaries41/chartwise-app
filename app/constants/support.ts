export const DISCORD_INVITE_URL = process.env.DISCORD_INVITE_URL || ''

export const CONTACT_EMAIL = "support@fpflabs.app" ;

export const NOTIFICATIONS_CONFIG = {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      options: { polling: false },
    },
}