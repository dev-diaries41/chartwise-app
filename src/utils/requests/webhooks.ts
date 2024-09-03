import axios from "axios";
import { Webhook } from "@src/types";
import { jobLogger } from "@src/logger";
import { hmacHash } from "../cryptography";

export async function sendWebhook(webhook: Webhook): Promise<boolean> {
    try {
        const secretKey = process.env.CHARTWISE_WEBHOOK_SECRET_KEY || 'your-secret-key';
        const signature = hmacHash(secretKey, JSON.stringify(webhook.payload));
        const response = await axios.post(webhook.url, webhook.payload, {
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
            },
        });

        jobLogger.info({ message: `Successfully sent webhook`, url: webhook.url });
        return response.status === 200;
    } catch (error: any) {
        jobLogger.error({ message: `Error sending webhook`, url: webhook.url, details: error.message });
        return false;
    }
}
