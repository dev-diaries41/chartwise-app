import dotenv from 'dotenv';
import { AIConfig } from "@src/types";

dotenv.config();

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
    replicate: {
        api_key: process.env.REPLICATE_API_TOKEN!, 
        models: {
            text: [
                "meta/meta-llama-3-70b-instruct"
            ],
            ocr: [
                "abiruyt/text-extract-ocr:a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61"
            ],
            vision: [
                "yorickvp/llava-13b:b5f6212d032508382d61ff00469ddda3e32fd8a0e75dc39d8a4191bb742157fb",
                "cuuupid/glm-4v-9b:a75c919339f65bf00afa96511af653fdbd0ec3cb0f5e6f4350809445eee0e14f"
            ],
            image: [
                "stability-ai/stable-diffusion-3"
            ],
            voice:[
                "openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2"
            ]
        },
        temperature: 0.2,
        max_tokens: 2000
    },
}