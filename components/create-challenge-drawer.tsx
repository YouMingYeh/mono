'use client';

import { Input } from './ui/input';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { challengesSchemas } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { experimental_useObject } from '@ai-sdk/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export function CreateChellengeDrawer({ trigger }: { trigger: React.ReactNode }) {
  const { object, submit, isLoading, error } = experimental_useObject({
    api: 'https://mono-rosy.vercel.app/api/challenges',
    schema: challengesSchemas
  });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<string>('');

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={cn('w-full h-full max-h-[80svh] overflow-auto')}>
        <DrawerHeader>
          <DrawerTitle className="text-center">Make a Challenge</DrawerTitle>
          <DrawerDescription className="text-center px-8">
            <p className="text-sm text-muted-foreground">
              Create a challenge yourself. Like What do you want to achieve? new skills, habits,
              etc.
            </p>
            <br />
            <p className="text-sm text-muted-foreground">
              You can also explore challenges made by others.
            </p>
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 px-8 py-6">
          <Input
            value={input}
            placeholder="Enter it here"
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-24 bg-muted/50 text-center text-lg overflow-auto"
          />
          <Button
            effect="shine"
            onClick={() => {
              submit({ prompt: input });
            }}
            type="button"
            disabled={isLoading}
          >
            Generate a 30-Day Challenge
            <Sparkles size={14} className="ml-2" />
          </Button>
          {JSON.stringify(object)}
          {JSON.stringify(error)}
        </div>

        <DrawerFooter>
          <DrawerClose className="w-full" asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
