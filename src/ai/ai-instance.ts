import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import Handlebars from 'handlebars';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
  handlebars: {
    knownHelpersOnly: false,
    registerHelper: (name: string, fn: Function) => {
      Handlebars.registerHelper(name, fn);
    },
  },
});

