'use client';

import { AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { impactFeedback, selectionFeedback } from '@tauri-apps/plugin-haptics';
import { MessageCircleDashed, PlusIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

type Mood = 'great' | 'good' | 'neutral' | 'low' | 'bad';
type Energy = 'high' | 'medium' | 'low';

interface MoodData {
  date: string;
  mood: Mood;
  energy: Energy;
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | null>(null);
  const [insight, setInsight] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);

  // Load saved mood data from localStorage
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('moodHistory');
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory));
    }

    // Check if mood was already tracked today
    const today = new Date().toISOString().split('T')[0];
    const todaysMood = moodHistory.find((item) => item.date === today);

    if (todaysMood) {
      setSelectedMood(todaysMood.mood);
      setSelectedEnergy(todaysMood.energy);
      generateInsight(todaysMood.mood, todaysMood.energy);
    }
  }, []);

  // Save mood history to localStorage
  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const trackMood = async () => {
    if (selectedMood && selectedEnergy) {
      const today = new Date().toISOString().split('T')[0];

      // Remove any existing entry for today
      const filteredHistory = moodHistory.filter((item) => item.date !== today);

      // Add today's mood
      const newMoodData: MoodData = {
        date: today,
        mood: selectedMood,
        energy: selectedEnergy
      };

      const updatedHistory = [...filteredHistory, newMoodData];
      setMoodHistory(updatedHistory);

      await impactFeedback('light');

      // Generate insight based on selection
      generateInsight(selectedMood, selectedEnergy);
    }
  };

  // Simulate AI generating insights based on mood and energy
  const generateInsight = (mood: Mood, energy: Energy) => {
    const insights = {
      great: {
        high: "You're at your peak! Great time for challenging tasks.",
        medium: "You're in a great mood with balanced energy. Ideal for focused work.",
        low: 'Your mood is great but energy is low. Consider gentle activities you enjoy.'
      },
      good: {
        high: 'Good mood and high energy - a productive combination!',
        medium: "You're in a good balanced state. Good time for steady progress.",
        low: 'Your positive mood can help you through low-energy tasks.'
      },
      neutral: {
        high: 'Your energy could be channeled into activities that might improve your mood.',
        medium: "You're in a balanced neutral state. Good for routine tasks.",
        low: 'Consider a short break or change of scenery to lift your mood.'
      },
      low: {
        high: 'Your energy is there, but mood is low. Physical activity might help balance this.',
        medium: 'Try to focus on small wins today to gradually lift your mood.',
        low: 'Be gentle with yourself today. Focus on self-care and rest.'
      },
      bad: {
        high: 'Your energy might feel chaotic with a bad mood. Consider calming activities.',
        medium: 'Take some time for yourself today if possible.',
        low: 'This is a good time to prioritize rest and recovery.'
      }
    };

    setInsight(insights[mood][energy]);
  };

  const moodEmojis: Record<Mood, string> = {
    great: '😄',
    good: '🙂',
    neutral: '😐',
    low: '🙁',
    bad: '😞'
  };

  const energyLabels: Record<Energy, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  const todayMood = moodHistory.find(
    (item) => item.date === new Date().toISOString().split('T')[0]
  );

  return (
    <AccordionItem value="mood" className="py-2">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="group focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6  transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
          <span className="flex items-center gap-3">
            <MessageCircleDashed
              size={16}
              className="shrink-0 opacity-60 group-data-[state=open]:opacity-100
                group-data-[state=open]:text-rose-500 transition-all duration-200"
              aria-hidden="true"
            />
            <span>
              {todayMood?.mood && todayMood.energy ? (
                <strong className="italic  font-mono underline text-nowrap">
                  Today: {moodEmojis[todayMood.mood]} with {energyLabels[todayMood.energy]} energy
                </strong>
              ) : (
                <span>Mood & Energy</span>
              )}
            </span>
          </span>
          <PlusIcon
            size={16}
            className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent className="pt-2 pb-8">
        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">How are you feeling today?</p>
            <div className="flex justify-between">
              {(Object.keys(moodEmojis) as Mood[]).map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? 'default' : 'ghost'}
                  className="text-xl px-3"
                  onClick={async () => {
                    setSelectedMood(mood);
                    await selectionFeedback();
                  }}
                  aria-label={`Mood: ${mood}`}
                >
                  {moodEmojis[mood]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Energy level:</p>
            <div className="flex justify-between gap-2">
              {(Object.keys(energyLabels) as Energy[]).map((energy) => (
                <Button
                  key={energy}
                  variant={selectedEnergy === energy ? 'default' : 'ghost'}
                  className="flex-1 text-xs"
                  onClick={async () => {
                    setSelectedEnergy(energy);
                    await selectionFeedback();
                  }}
                >
                  {energyLabels[energy]}
                </Button>
              ))}
            </div>
          </div>

          {selectedMood && selectedEnergy ? (
            <Button onClick={trackMood} className="w-full" size="sm">
              Save
            </Button>
          ) : (
            <Button disabled className="w-full" size="sm">
              Select Mood & Energy
            </Button>
          )}

          {insight && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p>{insight}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
