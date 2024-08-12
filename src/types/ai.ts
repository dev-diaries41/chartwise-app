import { WebhookEventType } from "replicate";


export type ReplicateModel = `${string}/${string}` | `${string}/${string}:${string}`;

export interface AIConfig {
    openai?: {
        api_key: string; 
        models: {
            text?: string[],
            image?: string[],
            video?: string[],
            vision?: string[]

        },
        temperature?: number,
        max_tokens?: number,
    },
    replicate?: {
        api_key: string; 
        models: {
            image?: ReplicateModel[],
            ocr?: ReplicateModel[],
            text?: ReplicateModel[],
            vision?: ReplicateModel[],
            video?: ReplicateModel[],
            voice?: ReplicateModel[],
            voice_clone?: ReplicateModel[],
        },
        temperature?: number,
        max_tokens?: number,
    }
}

export interface ReplicateRunParams {
    model: ReplicateModel;
    options: { 
        input: object; 
        wait?: { 
        interval?: number | undefined; } | undefined; 
        webhook?: string | undefined; 
        webhook_events_filter?: WebhookEventType[] | undefined; 
        signal?: AbortSignal | undefined; 
    }
}

export interface ImageGenOpts {
    cfg: number;
    aspect_ratio:  string;
    output_format:  string;
    output_quality: number,
    negative_prompt:  string;
  }

export interface TranscribeOpts {
    model: string;
    language: string;
    translate: boolean;
    temperature: number;
    transcription: string;
    suppress_tokens: string;
    logprob_threshold: number;
    no_speech_threshold: number;
    condition_on_previous_text: boolean;
    compression_ratio_threshold: number;
    temperature_increment_on_fallback: number;
  }
  

export  interface EventHandler {
    event: string;
    handler: (args: any) => void;
}
  