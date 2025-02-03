export const DISCORD_INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || ''
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL
export const TWITTER_PROFILE=process.env.NEXT_PUBLIC_TWITTER_PROFILE || ''

export const NOTIFICATIONS_CONFIG = {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      options: { polling: false },
    },
}