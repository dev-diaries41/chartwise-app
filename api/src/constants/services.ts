export const BackgroundJobs = {
    REMOVE_EXPIRED_JOBS: 'remove-expired-jobs',
    MANAGE_LOGS: 'manage-logs'
}

export const TelegramWebhook = {
    url: process.env.TELEGRAM_UPDATE_WEBHOOK_URL!,
    secret: process.env.TELEGRAM_SECRET!,
}

export const CHART_ANALYSIS_TG = 'chart-analysis-tg';
export const FREE_DAILY_LIMIT = 3;
export const FREE_MONTHLY_LIMIT = 6
export const FREE_TOTAL_LIMIT = FREE_MONTHLY_LIMIT;
