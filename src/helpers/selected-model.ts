// Groq:
// pnpm i @ai-sdk/groq
import { groq } from '@ai-sdk/groq';

// Anthropic:
// pnpm i @ai-sdk/anthropic
import { anthropic } from '@ai-sdk/anthropic';

// OpenAI:
// pnpm i @ai-sdk/openai
import { openai } from '@ai-sdk/openai';

// Gemini:
// pnpm i @ai-sdk/google
import { google } from '@ai-sdk/google';

// Ollama:
// pnpm i ollama-ai-provider-v2
// A diferencia de los anteriores, este es un proveedor comunitario.
import { ollama } from 'ollama-ai-provider-v2';

// Groq:
// export const model = groq('openai/gpt-oss-120b');

// Anthropic:
// export const model = anthropic('claude-haiku-4-5');

// OpenAI:
// export const model = openai('gpt-5-mini');

// Gemini:
// export const model = google('gemini-3.8-flash');
export const model = google('gemini-3.5-flash-lite');

// Ollama:
// export const model = ollama('qwen2:0.5b');

// export enum Model {
//     // Local models:
//     OLLAMA_QWEN2_0_5B = 'qwen2:0.5b',
//     // Gemini models:
//     GEMINI_3_5_FLASH = 'gemini-3.8-flash',
//     GEMINI_3_5_FLASH_LITE = 'gemini-3.5-flash-lite',

//     DEFAULT = GEMINI_3_5_FLASH
// }
