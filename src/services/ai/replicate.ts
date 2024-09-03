import dotenv from 'dotenv';
import Replicate from 'replicate';
import { ModelErrors } from './errors';
import { aiConfig } from './config';
import { defaultPromptTemplate } from './constants/replicate';
import { defaultImageGenOpts, defaultTranscribeOpts } from './constants/replicate';
import { ImageGenOpts, ReplicateRunParams, TranscribeOpts } from '@src/types';

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function run<T>(runParams: ReplicateRunParams): Promise<T> {
  const { model, options } = runParams;
  const output = await replicate.run(model, options);
  return output as T;
}

async function getOpts() {
  const {max_tokens, temperature} = aiConfig.replicate || {}
  return {max_tokens, temperature};
}

export async function generateText(prompt: string, prompt_template: string = defaultPromptTemplate) {
  if(!aiConfig.replicate?.models.text?.[0])throw new Error(ModelErrors.ERROR_MISSING_TEXT_MODEL)
  const input = { prompt, prompt_template };
  for await (const event of replicate.stream(aiConfig.replicate.models.text[0], { input })) {
    process.stdout.write(`${event}`);
  }
}

export async function generateImage(prompt: string, opts: ImageGenOpts = defaultImageGenOpts): Promise<string> {
  const input = { prompt, ...opts };
  if (!aiConfig.replicate?.models.image) throw new Error(ModelErrors.ERROR_MISSING_IMAGE_MODEL);
  const runParams = { model: aiConfig.replicate.models.image[0], options: { input } };
  const imageUrls = await run<string[]>(runParams);
  return Array.isArray(imageUrls)? imageUrls[0] : imageUrls
}

export async function generateTextFromImage(prompt: string, image: string): Promise<string> {
  if(!aiConfig.replicate?.models.vision?.[0])throw new Error(ModelErrors.ERROR_MISSING_VISION_MODEL)
  const opts = await getOpts();
  const input = { prompt, image, ...opts };
  const runParams = { model: aiConfig.replicate.models.vision[0], options: { input } };
  const output = await run<string[]>(runParams);
  return output.join(' ');
}

// Supported audio format: wav
export async function generateTextFromAudio(audio: string, opts: TranscribeOpts = defaultTranscribeOpts): Promise<string> {
  if (!aiConfig.replicate?.models.voice?.[0]) throw new Error(ModelErrors.ERROR_MISSING_VOICE_MODEL);
  const input = { audio, ...opts };
  const runParams = { model: aiConfig.replicate.models.voice[0], options: { input } };
  const output = await run<string[]>(runParams);
  return output.join(' ');
}

export async function extractText(image: string): Promise<string> {
  if(!aiConfig.replicate?.models.ocr?.[0])throw new Error(ModelErrors.ERROR_MISSING_OCR_MODEL)
  const runParams = { model: aiConfig.replicate.models.ocr[0], options: { input: { image } } };
  const extractedText = await run<string>(runParams);
  return extractedText.toString();
}