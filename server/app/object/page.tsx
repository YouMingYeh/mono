'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';

const challengeSchema = z.object({
  day: z.number().describe('The day of the challenge from 1 to 30'),
  title: z.string().describe('The title of the challenge'),
  description: z.string().describe('The description of the challenge')
});
const challengesSchemas = z.array(challengeSchema);

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/challenges',
    schema: challengesSchemas,
  });

  return (
    <>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>

      {object?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.title}</p>
          <p>{notification?.description}</p>
        </div>
      ))}
    </>
  );
}