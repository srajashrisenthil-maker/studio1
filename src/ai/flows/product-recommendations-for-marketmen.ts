'use server';
/**
 * @fileOverview Provides product recommendations to marketmen based on their previous orders and product ratings.
 *
 * - getProductRecommendations - A function that takes a marketman's order history and returns product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {Product} from '@/lib/types';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  orderHistory: z.array(
    z.object({
      productId: z.string().describe('The ID of the product.'),
      quantity: z.number().describe('The quantity of the product ordered.'),
      orderDate: z.string().describe('The date the order was placed.'),
    })
  ).describe('The marketman historical order data.'),
  availableProducts: z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        image: z.string(),
        imageHint: z.string(),
        farmerId: z.string(),
        price: z.number(),
        rating: z.number(),
    })
  ).describe('The list of all available products with their details and ratings.')
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
  prompt: `You are an expert in recommending products to marketmen based on their past order history and product ratings.

  Analyze the following order history and the list of available products. Provide product recommendations that are based on what the marketman buys frequently, but also prioritize products with higher ratings. Explain why each product is being recommended.

  Order History:
  {{#each orderHistory}}
  - Product ID: {{{productId}}}, Quantity: {{{quantity}}}, Order Date: {{{orderDate}}}
  {{/each}}
  
  Available Products (with ratings out of 5):
  {{#each availableProducts}}
  - Product ID: {{{id}}}, Name: {{{name}}}, Rating: {{{rating}}}
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
