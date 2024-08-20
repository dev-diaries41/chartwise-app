import OpenAI from "openai";
import dotenv from 'dotenv'
import { aiConfig } from "@src/ai/config";
import { ModelErrors } from "@src/ai/errors";
import { ChatCompletionContentPartImage } from "openai/resources";

dotenv.config()
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


export async function generateText(prompt: string) {
    if(!aiConfig.openai?.models.text?.[0])throw new Error(ModelErrors.ERROR_MISSING_TEXT_MODEL)
    const {temperature} = aiConfig.openai;
    const response = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "You are a genius report writer assistant."},
            {"role": "user", "content": prompt},
        ],
        model: aiConfig.openai.models.text[0],
        temperature: temperature
    });
    return response.choices[0];
}

export async function generateTextFromImage(prompt:string, imageUrl: string) {
    if(!aiConfig.openai?.models.vision?.[0])throw new Error(ModelErrors.ERROR_MISSING_VISION_MODEL)
    const {temperature, max_tokens} = aiConfig.openai;
    const response = await openai.chat.completions.create({
    model: aiConfig.openai.models.vision[0],
    temperature,
    max_tokens,
    messages: [
        {role: "system", content: "You are an expert profitable trading assistant specialising in cryptocurrency, stocks and forex."},
        {
        role: "user",
        content: [
        { type: "text", text: prompt },
        {type: "image_url", image_url: {url: imageUrl, detail: 'high'}}
    ]
    },
    ]});
    return response.choices[0].message.content;
}

export async function generateTextFromMutliImages(prompt:string, imageUrls: string[]) {
    const imageContent = imageUrls.map(url => ({type: "image_url" as  "image_url", image_url: {url, detail: 'high' as  ChatCompletionContentPartImage.ImageURL['detail']}}));
    const content = [{ type: "text" as 'text', text: prompt }, ...imageContent]
    if(!aiConfig.openai?.models.vision?.[0])throw new Error(ModelErrors.ERROR_MISSING_VISION_MODEL)
    const {temperature, max_tokens} = aiConfig.openai;
    const response = await openai.chat.completions.create({
    model: aiConfig.openai.models.vision[0],
    temperature,
    max_tokens,
    messages: [
        {role: "system", content: "You are an expert profitable trading assistant specialising in cryptocurrency, stocks and forex."},
        {
        role: "user",
        content:[...content]
    },
    ]});
    return response.choices[0].message.content;
}