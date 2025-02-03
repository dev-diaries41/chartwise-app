import { Request, Response } from "express";
import { logger} from "../logger";
import { chartAnalysisQueue } from "../index";
import TelegramBot from "node-telegram-bot-api";
import { CHART_ANALYSIS_TG } from "@src/constants/services";


export async function telegramChartAnalysis (req: Request, res: Response) {
  try {
    const update = req.body as TelegramBot.Update;
    res.status(200).json({ success: true, message: 'Webhook request received' });
    await chartAnalysisQueue.addToQueue({name: CHART_ANALYSIS_TG, opts: {delay: Date.now()}, data: { update }});
  } catch (error) {
    logger.error(`Error in telegramChartAnalysis: ${error}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


