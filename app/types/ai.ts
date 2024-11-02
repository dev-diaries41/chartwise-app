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
}