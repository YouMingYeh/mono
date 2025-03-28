'use client';

import { Sticker } from './sticker';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Memo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Challenge() {
  const [currentDay, setCurrentDay] = useState<number>(12);
  const [memo, setMemo] = useState<Memo[]>([
    {
      challengeId: '1',
      day: 1,
      content: 'Day 1 - Start your journey with a simple task.',
      sticker: 'cat'
    },
    {
      challengeId: '1',
      day: 2,
      content: 'Day 2 - Keep pushing forward, you got this!',
      sticker: 'rabbit'
    },
    {
      challengeId: '1',
      day: 3,
      content: 'Day 3 - Remember to take breaks and stay hydrated.',
      sticker: 'mo'
    }
  ]);

  return (
    <main className="flex flex-col items-start justify-center my-4">
      <h1 className="text-4xl font-light font-mono tabular-nums tracking-tight">
        Today's Challenge
      </h1>
      <br />
      <h3 className="text-lg font-light font-mono tabular-nums tracking-tight">
        Day <strong>{currentDay}</strong> of 30
      </h3>
      <div className="grid grid-cols-5 gap-4 my-4 w-full h-full">
        {/* 5 x 6 circles */}
        {Array.from({ length: 5 * 6 }, (_, index) => (
          <div
            key={index}
            className={cn(
              'aspect-square rounded-full bg-primary/10 flex items-center justify-center',
              {
                'bg-background border': index + 1 <= currentDay
              },
              {
                'border-primary border-2': index + 1 === currentDay
              }
            )}
          >
            {memo[index] ? (
              <Drawer>
                <DrawerTrigger asChild>
                  {memo[index].sticker ? (
                    <Sticker name={memo[index].sticker} />
                  ) : (
                    <span
                      className={cn('text-xl font-bold', {
                        'text-primary': index + 1 <= currentDay,
                        'text-primary/20': index + 1 > currentDay
                      })}
                    >
                      {index + 1}
                    </span>
                  )}
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerTitle>{memo[index].content}</DrawerTitle>
                  <DrawerDescription>
                    This is the description for day {index + 1}.
                  </DrawerDescription>
                </DrawerContent>
              </Drawer>
            ) : (
              <span
                className={cn('text-xl font-bold', {
                  'text-primary': index + 1 <= currentDay,
                  'text-primary/20': index + 1 > currentDay
                })}
              >
                {index + 1}
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
