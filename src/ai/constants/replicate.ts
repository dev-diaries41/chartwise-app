import { ImageGenOpts, TranscribeOpts } from "../../types";

export const defaultPromptTemplate = "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n";

const default_negative_prompt = "disfigured mouth, disfigured teeth, half head, half face, blury, side looking, old, wrinkle, child, no face, pencil, full body, sharp, far away, overlapping, duplication, nude, disfigured, kitsch, oversaturated, grain, low-res, Deformed, blurry, bad anatomy, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long body, disgusting, poorly drawn, childish, mutilated, mangled, surreal, out of frame, duplicate, 2 faces";

export const defaultImageGenOpts: ImageGenOpts= {
    cfg: 7,
    aspect_ratio: "3:2",
    output_format: "png",
    output_quality: 90,
    negative_prompt: default_negative_prompt
  }

export const defaultTranscribeOpts: TranscribeOpts = {
  model: "large-v3",
  language: "af",
  translate: false,
  temperature: 0,
  transcription: "plain text",
  suppress_tokens: "-1",
  logprob_threshold: -1,
  no_speech_threshold: 0.6,
  condition_on_previous_text: true,
  compression_ratio_threshold: 2.4,
  temperature_increment_on_fallback: 0.2
};


