'use client';

import { AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/hooks/use-store';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PlusIcon, Star } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// Predefined highlight suggestions
const HIGHLIGHT_SUGGESTIONS = [
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
];

export default function DailyHighlight() {
  const { activeHighlight, handleUpdateHighlight } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize suggestions on mount
  useEffect(() => {
    refreshSuggestions(true);
  }, []);

  // Function to refresh suggestion list
  const refreshSuggestions = useCallback(
    (isInitial = false) => {
      const shuffled = [...HIGHLIGHT_SUGGESTIONS].sort(() => Math.random() - 0.5);
      const count = isInitial ? 4 : Math.min(7, suggestions.length + 2);
      setSuggestions(shuffled.slice(0, count));
    },
    [suggestions?.length]
  );

  // Switch to edit mode and focus input
  const startEditing = useCallback(() => {
    setIsEditing(true);
    // Focus input after render
    setTimeout(() => document.querySelector('input')?.focus(), 0);
  }, []);

  // Complete editing and save highlight
  const finishEditing = useCallback(() => {
    if (activeHighlight.trim()) {
      setIsEditing(false);
    }
  }, [activeHighlight]);

  // Select a suggestion as the highlight
  const selectSuggestion = useCallback(
    async (suggestion: string) => {
      await handleUpdateHighlight(suggestion);
      setIsEditing(false);
    },
    [handleUpdateHighlight]
  );

  return (
    <AccordionItem value="highlight" className="py-2">
      <AccordionHeader activeHighlight={activeHighlight} isEditing={isEditing} />

      <AccordionContent className="text-muted-foreground pb-8 pt-2">
        {isEditing ? (
          <HighlightEditor
            value={activeHighlight}
            onChange={handleUpdateHighlight}
            onSave={finishEditing}
            suggestions={suggestions}
            onSelectSuggestion={selectSuggestion}
            onLoadMore={refreshSuggestions}
          />
        ) : (
          <HighlightViewer activeHighlight={activeHighlight} onEdit={startEditing} />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

// Header component with trigger
function AccordionHeader({
  activeHighlight,
  isEditing
}: {
  activeHighlight: string;
  isEditing: boolean;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
        <span className="flex items-center gap-3">
          <Star
            size={16}
            className="shrink-0 opacity-60 group-data-[state=open]:opacity-100 group-data-[state=open]:text-yellow-500 transition-all duration-200"
            aria-hidden="true"
          />
          <span>
            {activeHighlight && !isEditing ? (
              <strong className="italic underline">{activeHighlight}</strong>
            ) : (
              "Choose today's highlight"
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
  );
}

// Editor component for highlight
function HighlightEditor({
  value,
  onChange,
  onSave,
  suggestions,
  onSelectSuggestion,
  onLoadMore
}: {
  value: string;
  onChange: (value: string) => Promise<void>;
  onSave: () => void;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => Promise<void>;
  onLoadMore: () => void;
}) {
  return (
    <div className="space-y-4 p-1">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={async (e) => await onChange(e.target.value)}
          placeholder="What's your focus?"
          className="flex-1 bg-background"
        />
        <Button onClick={onSave} size="sm" disabled={!value.trim()}>
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
                onClick={() => onSelectSuggestion(suggestion)}
                className="text-xs h-8 px-2 whitespace-nowrap"
              >
                {suggestion}
              </Button>
            ))}

            {suggestions.length < HIGHLIGHT_SUGGESTIONS.length && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onLoadMore}
                className="text-xs h-8 px-2 whitespace-nowrap"
              >
                More ideas...
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Viewer component for highlight
function HighlightViewer({
  activeHighlight,
  onEdit
}: {
  activeHighlight: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm">{activeHighlight ? '↑ Go for it!' : 'Add a highlight to start!'}</p>
      <Button variant="secondary" size="sm" onClick={onEdit} className="text-xs h-7 px-2">
        {activeHighlight ? 'Edit' : 'Add'}
      </Button>
    </div>
  );
}
