'use client';

import { AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getMoods, createMood, updateMood, deleteMood } from '@/lib/db';
import { Energy, Mood, MoodCreate, MoodType } from '@/lib/types';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { impactFeedback, selectionFeedback } from '@tauri-apps/plugin-haptics';
import {
  MessageCircleDashed,
  PlusIcon,
  HistoryIcon,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';

const insights = {
  great: {
    high: 'You’re on fire today! High energy and a great mood—perfect for crushing big goals or starting a new project.',
    medium: 'Feeling great with steady energy? Tackle those priority tasks with focus and flair!',
    low: 'Your mood’s soaring, even if energy’s low. Keep it light—review plans or brainstorm ideas.'
  },
  good: {
    high: 'Good mood, high energy—ideal for powering through your to-do list with momentum!',
    medium: 'You’re in a solid groove. Make steady progress on key tasks and build on it tomorrow.',
    low: 'Good vibes with a slower pace? Wrap up loose ends or prep for a stronger day ahead.'
  },
  neutral: {
    high: 'Energy’s up, mood’s steady—channel it into a productive sprint or a challenging task!',
    medium: 'Balanced and ready! Knock out routine work or organize your next big move.',
    low: 'Feeling neutral and low on steam? Take a quick breather, then tackle something small.'
  },
  low: {
    high: 'Energy’s strong, but mood’s off? Push through with a focused workout or a key deliverable.',
    medium: 'Low mood, decent energy—check off quick wins to lift your spirits and keep moving.',
    low: 'Running on empty today? Recharge with a break and plan for a fresh start tomorrow.'
  },
  bad: {
    high: 'High energy, tough mood? Burn it off with a brisk walk or dive into a task to shift gears.',
    medium: 'Struggling but still in the game? Focus on one achievable goal to regain control.',
    low: 'Rough day, low reserves? Step back, rest up, and set yourself up for a better tomorrow.'
  }
};

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | null>(null);
  const [insight, setInsight] = useState('');
  const [moodHistory, setMoodHistory] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch moods from database on component mount
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        const moods = await getMoods();
        setMoodHistory(moods);

        // Check for today's mood and set selected values
        const today = new Date().toISOString().split('T')[0];
        const todaysMood = moods.find((item) => item.date === today);

        if (todaysMood) {
          setSelectedMood(todaysMood.mood as MoodType);
          setSelectedEnergy(todaysMood.energy as Energy);
          generateInsight(todaysMood.mood as MoodType, todaysMood.energy as Energy);
        }
      } catch (error) {
        console.error('Failed to fetch moods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  const trackMood = async () => {
    if (!selectedMood || !selectedEnergy) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const todaysMood = moodHistory.find((item) => item.date === today);

      // Generate insight text
      const newInsight = generateInsight(selectedMood, selectedEnergy);
      setInsight(newInsight);

      if (todaysMood) {
        // Update existing mood
        const updatedMood: Mood = {
          ...todaysMood,
          mood: selectedMood,
          energy: selectedEnergy,
          updated_at: new Date().toISOString()
        };

        await updateMood(updatedMood);

        // Update local state
        setMoodHistory((prevMoods) =>
          prevMoods.map((mood) => (mood.id === todaysMood.id ? updatedMood : mood))
        );
      } else {
        // Create new mood
        const newMoodData: MoodCreate = {
          date: today,
          mood: selectedMood,
          energy: selectedEnergy
        };

        const createdMood = await createMood(newMoodData);

        // Update local state
        setMoodHistory((prevMoods) => [...prevMoods, createdMood]);
      }

      await impactFeedback('light');
    } catch (error) {
      console.error('Failed to save mood:', error);
    }
  };

  const handleDeleteMood = async (id: string) => {
    try {
      await deleteMood(id);
      setMoodHistory((prevMoods) => prevMoods.filter((mood) => mood.id !== id));
      await impactFeedback('medium');
    } catch (error) {
      console.error('Failed to delete mood:', error);
    }
  };

  // Generate insight text based on mood and energy
  const generateInsight = (mood: MoodType, energy: Energy) => {
    setInsight(insights[mood][energy]);
    return insights[mood][energy];
  };

  const moodEmojis: Record<MoodType, string> = {
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

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Sort mood history by date (newest first)
  const sortedHistory = [...moodHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">Loading mood data...</div>
    );
  }

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
                  Today: {moodEmojis[todayMood.mood as MoodType]} with{' '}
                  {energyLabels[todayMood.energy as Energy]} energy
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
      <AccordionContent className="pt-2 pb-4">
        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">How&apos;s your mood today?</p>
            <div className="flex justify-between">
              {(Object.keys(moodEmojis) as MoodType[]).map((mood) => (
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
            <p className="text-xs text-muted-foreground">What&apos;s your energy like today?</p>
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
            {todayMood ? 'Update Mood' : 'Capture the Day!'}
          </Button>
          {insight && <p className="mt-2 text-xs text-muted-foreground">{insight}</p>}

          {/* History toggle button */}
          <div className="pt-4 border-t border-muted">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs flex items-center justify-center gap-1 text-muted-foreground"
              onClick={() => setShowHistory(!showHistory)}
            >
              <HistoryIcon size={14} className="mr-1" />
              {showHistory ? 'Hide' : 'Show'} Mood History
              {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>

          {/* Mood history section */}
          {showHistory && (
            <div className="pt-2 space-y-3 animate-in fade-in duration-200">
              <h4 className="text-sm font-medium">Your Mood Journal</h4>

              {sortedHistory.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-3">
                  No previous mood entries found.
                </p>
              ) : (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {sortedHistory.map((item) => (
                    <div
                      key={item.id}
                      className="text-xs p-2 border border-border rounded-md bg-card relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{formatDate(item.date)}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1"
                          onClick={() => handleDeleteMood(item.id)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-base">{moodEmojis[item.mood as MoodType]}</span>
                        <span>with {energyLabels[item.energy as Energy]} energy</span>
                      </div>
                      {insights[item.mood][item.energy] && (
                        <p className="mt-1 text-muted-foreground">
                          {insights[item.mood][item.energy]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs mt-2"
                onClick={() => setShowHistory(false)}
              >
                Close History
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
