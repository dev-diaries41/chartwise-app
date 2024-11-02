import { AIConfig } from "@/app/types";

export const aiConfig: AIConfig = {
    openai: {
        api_key: process.env.OPENAI_API_KEY!, 
        models: {
            text: ["gpt-3.5-turbo", "gpt-4o"],
            vision: ["gpt-4o"],
        },
        temperature: 0,
        max_tokens: 2000
    },
}