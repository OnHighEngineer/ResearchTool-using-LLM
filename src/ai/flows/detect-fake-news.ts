'use server';
/**
 * @fileOverview Detects fake news from user input using a Genkit flow.
 *
 * - detectFakeNews - A function that handles the fake news detection process.
 * - DetectFakeNewsInput - The input type for the detectFakeNews function.
 * - DetectFakeNewsOutput - The return type for the detectFakeNews function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getWebPageContent} from '@/services/url-content';

const DetectFakeNewsInputSchema = z.object({
  input: z.string().describe('The article text or URL to check for fake news.'),
});
export type DetectFakeNewsInput = z.infer<typeof DetectFakeNewsInputSchema>;

const DetectFakeNewsOutputSchema = z.object({
  result: z.enum(['Real', 'Fake']).describe('The fake news detection result.'),
  score: z.number().describe('A score indicating the likelihood of the input being fake news (0-1).'),
  cleanedInput: z.string().describe('A cleaned version of the input text.'),
  reasoning: z.string().optional().describe('The parts of the article most affect the overall determination of whether the article is fake.'),
});
export type DetectFakeNewsOutput = z.infer<typeof DetectFakeNewsOutputSchema>;

export async function detectFakeNews(input: DetectFakeNewsInput): Promise<DetectFakeNewsOutput> {
  return detectFakeNewsFlow(input);
}

const decideHowToIncorporateTheUserQueryTool = ai.defineTool({
  name: 'extractReasoning',
  description: 'Extract the parts of the article most affect the overall determination of whether the article is fake.',
  inputSchema: z.object({
    article: z.string().describe('The article text'),
    isFake: z.boolean().describe('A boolean representing whether the article is fake or not'),
  }),
  outputSchema: z.string().describe('The reasoning behind classifying the article as real or fake.'),
},
async input => {
  // This can call any typescript function.
  // Return the reasoning
  return `The article is ${input.isFake ? 'fake' : 'real'} because of these reasons found in the article: ${input.article}`;
}
);


const detectFakeNewsPrompt = ai.definePrompt({
  name: 'detectFakeNewsPrompt',
  input: {
    schema: z.object({
      input: z.string().describe('The article text to check for fake news.'),
    }),
  },
  output: {
    schema: z.object({
      result: z.enum(['Real', 'Fake']).describe('The fake news detection result.'),
      score: z.number().describe('A score indicating the likelihood of the input being fake news (0-1).'),
      cleanedInput: z.string().describe('A cleaned version of the input text.'),
    }),
  },
  tools: [decideHowToIncorporateTheUserQueryTool],
  prompt: `You are a fake news detection expert. You will be given an article and you will determine if it is real or fake news.

  Article: {{{input}}}

  Respond with a determination of \"Real\" or \"Fake\", a score between 0 and 1 indicating the likelihood of the input being fake news, and a cleaned version of the input text.

  Consider the following:
  - Sensationalism
  - Lack of sourcing
  - Bias

  {{#tool_use "extractReasoning"}} If the article is fake, use the extractReasoning tool to explain why. {{/tool_use}}
  `,
});

const detectFakeNewsFlow = ai.defineFlow<
  typeof DetectFakeNewsInputSchema,
  typeof DetectFakeNewsOutputSchema
>(
  {
    name: 'detectFakeNewsFlow',
    inputSchema: DetectFakeNewsInputSchema,
    outputSchema: DetectFakeNewsOutputSchema,
  },
  async input => {
    let articleText = input.input;

    // Check if the input is a URL
    if (input.input.startsWith('http://') || input.input.startsWith('https://')) {
      try {
        const webPageContent = await getWebPageContent(input.input);
        articleText = webPageContent.content;
      } catch (error) {
        console.error('Error fetching content from URL:', error);
        throw new Error('Failed to fetch content from the provided URL.');
      }
    }

    const {output, completeToolCalls} = await detectFakeNewsPrompt({
      input: articleText,
    });

    let reasoning: string | undefined = undefined;

    if (output?.result === 'Fake' && completeToolCalls?.extractReasoning) {
      reasoning = completeToolCalls.extractReasoning.output;
    }

    return {
      ...output!,
      cleanedInput: output!.cleanedInput,
      reasoning,
    };
  }
);

