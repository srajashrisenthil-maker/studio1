'use server';
/**
 * @fileOverview Provides product recommendations to marketmen based on their previous orders.
 *
 * - getProductRecommendations - A function that takes a marketman's order history and returns product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  orderHistory: z.array(
    z.object({
      productId: z.string().describe('The ID of the product.'),
      quantity: z.number().describe('The quantity of the product ordered.'),
      orderDate: z.string().describe('The date the order was placed.'),
    })
  ).describe('The marketman historical order data.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      productId: z.string().describe('The ID of the recommended product.'),
      reason: z.string().describe('The reason for the recommendation.'),
    })
  ).describe('A list of product recommendations for the marketman.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert in recommending products to marketmen based on their past order history.

  Analyze the following order history and provide product recommendations. Explain why each product is being recommended.

  Order History:
  {{#each orderHistory}}
  - Product ID: {{{productId}}}, Quantity: {{{quantity}}}, Order Date: {{{orderDate}}}
  {{/each}}

  Recommendations:`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
