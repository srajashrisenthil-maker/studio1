'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered price prediction for agricultural products.
 *
 * It takes into account market trends and logistics costs to help farmers optimize their earnings.
 * @param {AIPricePredictionInput} input - The input data for price prediction, including product details, market trends, and logistics information.
 * @returns {Promise<AIPricePredictionOutput>} - A promise that resolves with the AI's price prediction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {run} from 'genkit/flow';

// Input schema for the AI price prediction flow
const AIPricePredictionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  marketTrends: z.string().describe('Current market trends for the product.'),
  logisticsCost: z.number().describe('The cost of logistics for delivering the product.'),
  distanceToMarket: z.number().describe('The distance to the market in kilometers.'),
  productImage: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIPricePredictionInput = z.infer<typeof AIPricePredictionInputSchema>;

// Output schema for the AI price prediction flow
const AIPricePredictionOutputSchema = z.object({
  predictedPrice: z.number().describe('The AI-predicted price for the product.'),
  reasoning: z.string().describe('The AI reasoning behind the predicted price.'),
});
export type AIPricePredictionOutput = z.infer<typeof AIPricePredictionOutputSchema>;

// Tool definition for fetching market information
const getMarketInformation = ai.defineTool({
  name: 'getMarketInformation',
  description: 'Retrieves current market information for a given product.',
  inputSchema: z.object({
    productName: z.string().describe('The name of the product.'),
  }),
  outputSchema: z.string().describe('Current market information for the product.'),
},
async (input) => {
  // Simulate fetching market information (replace with actual implementation)
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
  return `Simulated market information for ${input.productName}: High demand, prices are up 10%`;
});

// Define the prompt for AI price prediction
const aiPricePredictionPrompt = ai.definePrompt({
  name: 'aiPricePredictionPrompt',
  input: {schema: AIPricePredictionInputSchema},
  output: {schema: AIPricePredictionOutputSchema},
  tools: [getMarketInformation],
  prompt: `You are an AI assistant that helps farmers predict the optimal price for their products.

  Consider the following information:
  - Product Name: {{{productName}}}
  - Product Description: {{{productDescription}}}
  - Product Image: {{media url=productImage}}
  - Market Trends: {{{marketTrends}}}
  - Logistics Cost: {{{logisticsCost}}}
  - Distance to Market: {{{distanceToMarket}}}

  You can use the 'getMarketInformation' tool to get real-time market data for the product.

  Based on all available information, predict the price for the product and explain your reasoning.
  Make sure the predicted price is a number.
  `, // Added media template for product image
  // Add retry logic for transient errors
  backoff: {
    delay: '2s',
    maxRetries: 3,
  },
});

// Define the AI price prediction flow
const aiPricePredictionFlow = ai.defineFlow(
  {
    name: 'aiPricePredictionFlow',
    inputSchema: AIPricePredictionInputSchema,
    outputSchema: AIPricePredictionOutputSchema,
  },
  async input => {
    // Call the AI price prediction prompt to get the predicted price and reasoning
    const {output} = await aiPricePredictionPrompt(input);
    return output!;
  }
);

/**
 * Predicts the price of a product using AI, incorporating market trends and logistics costs.
 * @param input The input data for price prediction.
 * @returns A promise that resolves with the AI's price prediction.
 */
export async function aiPricePrediction(input: AIPricePredictionInput): Promise<AIPricePredictionOutput> {
  return aiPricePredictionFlow(input);
}
