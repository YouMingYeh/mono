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

  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('moodHistory');
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory));
    }

    const today = new Date().toISOString().split('T')[0];
    const todaysMood = moodHistory.find((item) => item.date === today);

    if (todaysMood) {
      setSelectedMood(todaysMood.mood);
      setSelectedEnergy(todaysMood.energy);
      generateInsight(todaysMood.mood, todaysMood.energy);
    }
  }, []);

  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const trackMood = async () => {
    if (selectedMood && selectedEnergy) {
      const today = new Date().toISOString().split('T')[0];
      const filteredHistory = moodHistory.filter((item) => item.date !== today);

      const newMoodData: MoodData = {
        date: today,
        mood: selectedMood,
        energy: selectedEnergy
      };

      const updatedHistory = [...filteredHistory, newMoodData];
      setMoodHistory(updatedHistory);

      await impactFeedback('light');
      generateInsight(selectedMood, selectedEnergy);
    }
  };

  const generateInsight = (mood: Mood, energy: Energy) => {
    const insights = {
      great: {
        high: 'You’re on fire today! High energy and a great mood—perfect for crushing big goals or starting a new project.',
        medium:
          'Feeling great with steady energy? Tackle those priority tasks with focus and flair!',
        low: 'Your mood’s soaring, even if energy’s low. Keep it light—review plans or brainstorm ideas.'
      },
      good: {
        high: 'Good mood, high energy—ideal for powering through your to-do list with momentum!',
        medium:
          'You’re in a solid groove. Make steady progress on key tasks and build on it tomorrow.',
        low: 'Good vibes with a slower pace? Wrap up loose ends or prep for a stronger day ahead.'
      },
      neutral: {
        high: 'Energy’s up, mood’s steady—channel it into a productive sprint or a challenging task!',
        medium: 'Balanced and ready! Knock out routine work or organize your next big move.',
        low: 'Feeling neutral and low on steam? Take a quick breather, then tackle something small.'
      },
      low: {
        high: 'Energy’s strong, but mood’s off? Push through with a focused workout or a key deliverable.',
        medium:
          'Low mood, decent energy—check off quick wins to lift your spirits and keep moving.',
        low: 'Running on empty today? Recharge with a break and plan for a fresh start tomorrow.'
      },
      bad: {
        high: 'High energy, tough mood? Burn it off with a brisk walk or dive into a task to shift gears.',
        medium: 'Struggling but still in the game? Focus on one achievable goal to regain control.',
        low: 'Rough day, low reserves? Step back, rest up, and set yourself up for a better tomorrow.'
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
        <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
          <span className="flex items-center gap-3">
            <MessageCircleDashed
              size={16}
              className="shrink-0 opacity-60 group-data-[state=open]:opacity-100
                group-data-[state=open]:text-rose-500 transition-all duration-200"
            />
            <span>
              {todayMood?.mood && todayMood.energy ? (
                <strong className="italic font-mono underline text-nowrap">
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
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent className="pt-2 pb-8">
        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">How’s your mood today?</p>
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
                >
                  {moodEmojis[mood]}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">What’s your energy like today?</p>
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
          <Button
            onClick={trackMood}
            className="w-full"
            size="sm"
            disabled={!selectedMood || !selectedEnergy}
          >
            {selectedMood && selectedEnergy ? 'Capture the Day!' : 'Choose mood & energy'}
          </Button>
          {insight && <p className="mt-2 text-xs text-muted-foreground">{insight}</p>}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
