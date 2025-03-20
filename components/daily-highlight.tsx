'use client';

import { AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PlusIcon, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DailyHighlight() {
  const [highlight, setHighlight] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allSuggestions] = useState<string[]>([
    'Count to 5 and start.',
    'Pair a habit with coffee.',
    'Focus deeply for 90 mins.',
    'List 3 things you’re grateful for.',
    'Take a quick walk.',
    'Hide your phone.',
    'Crush one small goal.',
    'Sleep early tonight.',
    'Imagine your win.',
    'Read 10 pages.',
    'Drink water now.',
    'Plan tomorrow’s top task.'
  ]); // Full list of suggestions

  // Load saved highlight from localStorage
  useEffect(() => {
    const savedHighlight = localStorage.getItem('dailyHighlight');
    if (savedHighlight) {
      setHighlight(savedHighlight);
    } else {
      setIsEditing(true);
    }
    loadInitialSuggestions();
  }, []);

  // Save highlight to localStorage
  useEffect(() => {
    if (highlight.trim()) {
      localStorage.setItem('dailyHighlight', highlight);
    }
  }, [highlight]);

  const loadInitialSuggestions = () => {
    const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 4));
  };

  const loadMoreSuggestions = () => {
    const currentSuggestions = [...suggestions];
    const unusedSuggestions = allSuggestions.filter((sug) => !currentSuggestions.includes(sug));
    const remaining = unusedSuggestions.length;

    if (remaining === 0) {
      // Reset to a fresh set if all suggestions are used
      const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
      setSuggestions(shuffled.slice(0, 5));
    } else {
      // Add up to 2 more unique suggestions, or fewer if less remain
      const newCount = Math.min(2, remaining);
      const newSuggestions = unusedSuggestions.sort(() => Math.random() - 0.5).slice(0, newCount);
      setSuggestions([...currentSuggestions, ...newSuggestions].slice(0, 7)); // Cap at 7 total
    }
  };

  const handleSave = () => {
    if (highlight.trim()) {
      setIsEditing(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setHighlight(suggestion);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => document.querySelector('input')?.focus(), 0);
  };

  return (
    <AccordionItem value="highlight" className="py-2">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
          <span className="flex items-center gap-3">
            <Star
              size={16}
              className="shrink-0 opacity-60 group-data-[state=open]:opacity-100 group-data-[state=open]:text-yellow-500 transition-all duration-200"
              aria-hidden="true"
            />
            <span>
              {highlight && !isEditing ? (
                <strong className="italic underline">{highlight}</strong>
              ) : (
                'Choose today’s highlight'
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
      <AccordionContent className="text-muted-foreground pb-8 pt-2">
        {isEditing ? (
          <div className="space-y-4 p-1">
            <div className="flex gap-2">
              <Input
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="What’s your focus?"
                className="flex-1 bg-background"
              />
              <Button onClick={handleSave} size="sm" disabled={!highlight.trim()}>
                Save
              </Button>
            </div>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Some ideas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => selectSuggestion(suggestion)}
                      className="text-xs h-8 px-2 whitespace-nowrap"
                    >
                      {suggestion}
                    </Button>
                  ))}
                  {suggestions.length < allSuggestions.length && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={loadMoreSuggestions}
                      className="text-xs h-8 px-2 whitespace-nowrap"
                    >
                      More ideas
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm">{highlight ? '↑ Go for it!' : 'Add a highlight to start!'}</p>
            <Button variant="secondary" size="sm" onClick={handleEdit} className="text-xs h-7 px-2">
              Edit
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
