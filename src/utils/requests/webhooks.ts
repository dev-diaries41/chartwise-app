import axios from "axios";
import { Webhook } from "@src/types";
import { jobLogger } from "@src/logger";

export async function sendWebhook(webhook: Webhook): Promise<boolean> {
      try {
        const response = await axios.post(webhook.url, webhook.payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!(response.status === 200)) throw new Error('Webhook not sent');

        jobLogger.info({message: `Successfully sent webhook`, url: webhook.url});
        return response.status === 200;
      } catch (error: any) {
        jobLogger.error({message:`Error sending webhook`, url: webhook.url, details: error.message});
        return false;
      }
}