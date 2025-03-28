'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ExploreChellengeDrawer({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={cn('w-full h-full max-h-[80svh] overflow-auto')}>
        <DrawerHeader>
          <DrawerTitle className="text-center">Explore Challenges</DrawerTitle>
        </DrawerHeader>

        <div></div>

        <DrawerFooter>
          <DrawerClose className="w-full" asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
