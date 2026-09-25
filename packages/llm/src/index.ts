export type { ExtractedBooking, ExtractorProvider } from './types';
import { GeminiAdapter } from './gemini';
import { OpenAIAdapter } from './openai';
import type { ExtractorProvider } from './types';

export function getExtractor(): ExtractorProvider {
  const provider = process.env.LLM_PROVIDER ?? 'gemini';
  if (provider === 'openai') return new OpenAIAdapter();
  return new GeminiAdapter();
}
