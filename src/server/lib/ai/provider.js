/**
 * @module provider
 * Provides functionality to generate text using different AI providers.
 * Currently supports the OpenAI provider.
 */

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import process from "node:process";

/**
 * Enum for supported AI service providers.
 * @readonly
 * @enum {string}
 */
export const ModelProvider = Object.freeze({
  OPENAI: "openai",
  GOOGLE: "google",
  ANTHROPIC: "anthropic",
  GROK: "grok",
});

/**
 * Enum for AI model sizes.
 * @readonly
 * @enum {string}
 */
export const ModelType = Object.freeze({
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
});

/**
 * Map of providers to their corresponding models based on size.
 * @readonly
 * @enum {Object}
 */
export const Models = Object.freeze({
  [ModelProvider.OPENAI]: {
    [ModelType.SMALL]: "gpt-4.1-nano",
    [ModelType.MEDIUM]: "gpt-4.1",
    [ModelType.LARGE]: "gpt-4.5",
  },
});

/**
 * Default configuration for text generation.
 * @readonly
 * @type {Object}
 * @property {number} temperature - Sampling temperature.
 * @property {number} maxInputTokens - Maximum input tokens.
 * @property {number} maxOutputTokens - Maximum output tokens.
 * @property {number} presencePenalty - Presence penalty.
 * @property {number} frequencyPenalty - Frequency penalty.
 */
const defaultConfig = Object.freeze({
  temperature: 0.7,
  maxInputTokens: 200 * 1000,
  maxOutputTokens: 8 * 1000,
  presencePenalty: 0.01,
  frequencyPenalty: 0.01,
});

/**
 * Generates text using the specified AI provider.
 *
 * @async
 * @function generateText
 * @param {string} prompt - The prompt to send to the AI.
 * @param {string} provider - The AI provider to use (e.g., ModelProvider.OPENAI).
 * @param {function} [streamCallback] - Optional callback that receives chunks of streamed text.
 * @param {string} [modelSize=ModelType.MEDIUM] - The size of the AI model to use.
 * @returns {Promise<{ data: string|null, error: (Error|string|null) }>} Result object containing either the generated text or an error.
 */
export async function generateText(
  prompt,
  provider,
  streamCallback = null,
  modelSize = ModelType.MEDIUM,
) {
  switch (provider) {
    case ModelProvider.OPENAI: {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return { data: null, error: `OPENAI_API_KEY not found.` };
      }
      try {
        const openai = createOpenAI({
          apiKey,
          compatibility: "strict",
        });

        const { textStream } = streamText({
          model: openai(Models[provider][modelSize]),
          prompt,
          ...defaultConfig,
        });

        let result = "";
        for await (const textPart of textStream) {
          if (streamCallback) {
            streamCallback(textPart);
          }
          result += textPart;
        }

        return { data: result, error: null };
      } catch (error) {
        return { data: null, error: error };
      }
    }

    default:
      return { data: null, error: `Provider ${provider} not supported.` };
  }
}
