import axios from "axios";
import { Webhook } from "../../types";
import { jobLogger } from "../../logger";

export async function sendWebhook(webhook: Webhook): Promise<boolean> {
      try {
        const response = await axios.post(webhook.url, webhook.payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!(response.status === 200)) {
          throw new Error('Webhook not sent')
        }
        jobLogger.info(`Successfully sent webhook to ${webhook.url}`);
        return response.status === 200;
      } catch (error) {
        console.error(`Error sending webhook to ${webhook.url}: ${error}`);
        return false;
      }
}