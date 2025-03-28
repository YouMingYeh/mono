import { z } from 'zod';

export const challengeSchema = z.object({
  day: z.number().describe('The day of the challenge from 1 to 30'),
  title: z.string().describe('The title of the challenge'),
  description: z.string().describe('The description of the challenge')
});
export const challengesSchemas = z.array(challengeSchema);
