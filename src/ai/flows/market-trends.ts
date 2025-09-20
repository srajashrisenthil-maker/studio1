'use server';
/**
 * @fileOverview A Genkit flow for providing market trend analysis for agricultural products.
 *
 * - getMarketTrends - A function that returns market trend data for a product.
 * - MarketTrendsInput - The input type for the getMarketTrends function.
 * - MarketTrendsOutput - The return type for the getMarketTrends function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketTrendsInputSchema = z.object({
  productName: z.string().describe('The name of the agricultural product.'),
});
export type MarketTrendsInput = z.infer<typeof MarketTrendsInputSchema>;

const MarketTrendsOutputSchema = z.object({
  trendSummary: z.string().describe('A summary of the current market trend for the product.'),
  priceHistory: z.array(
    z.object({
      date: z.string().describe('The date for the price point (e.g., "Jan 23").'),
      price: z.number().describe('The average price on that date.'),
    })
  ).describe('A list of historical price points for the last 6-8 months.'),
});
export type MarketTrendsOutput = z.infer<typeof MarketTrendsOutputSchema>;

export async function getMarketTrends(input: MarketTrendsInput): Promise<MarketTrendsOutput> {
  return marketTrendsFlow(input);
}

const marketTrendsPrompt = ai.definePrompt({
  name: 'marketTrendsPrompt',
  input: { schema: MarketTrendsInputSchema },
  output: { schema: MarketTrendsOutputSchema },
  prompt: `You are an agricultural market analyst. Your task is to provide a market trend summary and historical price data for a specific product.
  The user wants to understand the market trends for: {{{productName}}}.

  Simulate realistic historical price data based on the following commodity price information for India.
  - Prices tend to rise during off-seasons and fall during harvest seasons.
  - Weather events like monsoons can significantly impact prices.
  - Government policies and demand from large markets also influence prices.

  If the product is "Onion" or "Spicy Onions", use the following specific information:
  - Onion prices are highly volatile. They typically start rising from August, peak in November-December due to depleted old stocks and delayed arrival of the new Kharif crop.
  - Prices start to cool down from January onwards as the late Kharif and Rabi harvests enter the market.
  - Summer months (April-May) are usually stable with moderate prices.
  - Generate a price history that reflects this volatility, with prices (per kg) ranging from as low as ₹15-20 during harvest to as high as ₹80-100 during the peak lean season.

  For other products, generate a plausible trend. For any product, generate a concise trend summary and a list of 6-8 monthly average price points for the last few months.
  The date format should be "Mon 'YY" (e.g., "Jan 24").
  
  Example for "Tomatoes":
  Summary: "Tomato prices have been volatile, peaking during the summer months due to lower supply and stabilizing post-monsoon. Expect prices to remain stable for the next few weeks."
  Price History: [{date: "Jan 24", price: 30}, {date: "Feb 24", price: 35}, {date: "Mar 24", price: 45}, {date: "Apr 24", price: 55}, {date: "May 24", price: 70}, {date: "Jun 24", price: 60}]
  
  Now, generate the analysis for {{{productName}}}.
  `,
});

const marketTrendsFlow = ai.defineFlow(
  {
    name: 'marketTrendsFlow',
    inputSchema: MarketTrendsInputSchema,
    outputSchema: MarketTrendsOutputSchema,
  },
  async input => {
    const { output } = await marketTrendsPrompt(input);
    return output!;
  }
);
