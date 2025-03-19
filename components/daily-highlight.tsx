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

  // Load saved highlight from localStorage
  useEffect(() => {
    const savedHighlight = localStorage.getItem('dailyHighlight');
    if (savedHighlight) {
      setHighlight(savedHighlight);
    } else {
      // If no highlight is set, show the editing interface
      setIsEditing(true);
    }

    // Generate AI suggestions (simulated)
    generateSuggestions();
  }, []);

  // Save highlight to localStorage
  useEffect(() => {
    if (highlight) {
      localStorage.setItem('dailyHighlight', highlight);
    }
  }, [highlight]);

  // Simulate AI generating suggestions
  const generateSuggestions = () => {
    const aiSuggestions = [
      'Take a 30-minute walk outside',
      'Read one chapter of your book',
      'Connect with an old friend',
      'Spend 15 minutes meditating'
    ].sort(() => Math.random() - 0.5); // Shuffle suggestions
    setSuggestions(aiSuggestions);
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

  return (
    <AccordionItem value="highlight" className="py-2">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="group focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6  transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
          <span className="flex items-center gap-3">
            <Star
              size={16}
              className="shrink-0 opacity-60 group-data-[state=open]:opacity-100
                group-data-[state=open]:text-yellow-500 transition-all duration-200"
              aria-hidden="true"
            />
            <span>
              <span>
                {!isEditing && highlight ? (
                  <strong className="italic  underline text-nowrap">{highlight}</strong>
                ) : (
                  "What's your main focus today?"
                )}
              </span>{' '}
            </span>
          </span>
          <PlusIcon
            size={16}
            className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent className="text-muted-foreground pb-8">
        {isEditing ? (
          <div className="space-y-3 p-1">
            <div className="flex gap-2">
              <Input
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="What's your main focus today?"
                className="flex-1"
              />
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => selectSuggestion(suggestion)}
                      className="text-xs h-9 px-3"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p>{highlight}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs"
            >
              Edit
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
