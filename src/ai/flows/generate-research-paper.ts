// signal that this file is a server module
'use server';

/**
 * @fileOverview Generates a research paper based on a user-provided topic.
 *
 * - generateResearchPaper - A function that handles the research paper generation process.
 * - GenerateResearchPaperInput - The input type for the generateResearchPaper function.
 * - GenerateResearchPaperOutput - The return type for the generateResearchPaper function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateResearchPaperInputSchema = z.object({
  topic: z.string().describe('The topic of the research paper.'),
});
export type GenerateResearchPaperInput = z.infer<typeof GenerateResearchPaperInputSchema>;

const GenerateResearchPaperOutputSchema = z.object({
  title: z.string().describe('The title of the research paper.'),
  abstract: z.string().describe('A brief summary of the research paper.'),
  sections: z.array(
    z.object({
      title: z.string().describe('The title of the section.'),
      content: z.string().describe('The content of the section.'),
    })
  ).describe('The sections of the research paper.'),
});
export type GenerateResearchPaperOutput = z.infer<typeof GenerateResearchPaperOutputSchema>;

export async function generateResearchPaper(input: GenerateResearchPaperInput): Promise<GenerateResearchPaperOutput> {
  return generateResearchPaperFlow(input);
}

const decideHowToIncorporateQuery = ai.defineTool({
  name: 'decideHowToIncorporateQuery',
  description: 'Determines how to best incorporate the user query into the research paper.  For example, by making the query a focus, or by addressing and disproving the query.',
  inputSchema: z.object({
    query: z.string().describe('The user provided research topic.'),
  }),
  outputSchema: z.string().describe('The best way to incorporate the query into the paper.'),
}, async input => {
  // In a real implementation, this would use an LLM or other logic to determine
  // the best approach.
  return `Focus on ${input.query} as the core argument`;
});


const prompt = ai.definePrompt({
  name: 'generateResearchPaperPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the research paper.'),
      incorporationStrategy: z.string().describe('How to incorporate the user query into the research paper.'),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('The title of the research paper.'),
      abstract: z.string().describe('A brief summary of the research paper.'),
      sections: z.array(
        z.object({
          title: z.string().describe('The title of the section.'),
          content: z.string().describe('The content of the section.'),
        })
      ).describe('The sections of the research paper.'),
    }),
  },
  prompt: `You are an AI research assistant tasked with generating research papers on given topics.

  The user has requested a research paper on the following topic: {{{topic}}}.
  Here is the strategy for incorporating the topic: {{{incorporationStrategy}}}

  Please generate a research paper with a title, abstract, and 3 sections. Each section should have a title and content.
  Follow this format:
  ```json
  {
    "title": "Research Paper Title",
    "abstract": "A brief summary of the research paper.",
    "sections": [
      {
        "title": "Section 1 Title",
        "content": "Section 1 Content"
      },
      {
        "title": "Section 2 Title",
        "content": "Section 2 Content"
      },
      {
        "title": "Section 3 Title",
        "content": "Section 3 Content"
      }
    ]
  }
  ```
  `,tools:[decideHowToIncorporateQuery]
});

const generateResearchPaperFlow = ai.defineFlow<
  typeof GenerateResearchPaperInputSchema,
  typeof GenerateResearchPaperOutputSchema
>({
  name: 'generateResearchPaperFlow',
  inputSchema: GenerateResearchPaperInputSchema,
  outputSchema: GenerateResearchPaperOutputSchema,
}, async input => {
  const incorporationStrategy = await decideHowToIncorporateQuery({
    query: input.topic,
  });

  const {output} = await prompt({
    topic: input.topic,
    incorporationStrategy,
  });
  return output!;
});
