'use client';

import { Challenge } from '@/components/challenge';
import { Chat } from '@/components/chat';
import { MyGreetingMessage } from '@/components/my-greeting-message';
import { Onboard } from '@/components/onboard';
import { Profile } from '@/components/profile';
import { SettingsDrawer } from '@/components/settings-drawer';
import { Button } from '@/components/ui/button';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { impactFeedback } from '@tauri-apps/plugin-haptics';
import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState, useRef, useEffect, Suspense } from 'react';

const THRESHOLD = 150; // Minimum swipe distance in pixels

export default function Main() {
  const isMounted = useIsMounted();
  const { activeSection, handleUpdateSection } = useStore();
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // Handle swipe gesture for navigation and AI assistant
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;
    setIsSwiping(false);

    // For section navigation
    if (Math.abs(difference) > THRESHOLD) {
      if (difference > 0 && activeSection < 2) {
        // Swipe left - go to next section
        await handleUpdateSection(activeSection + 1);
        await impactFeedback('soft');
      } else if (difference < 0 && activeSection > 0) {
        // Swipe right - go to previous section
        await handleUpdateSection(activeSection - 1);
        await impactFeedback('soft');
      }
    }
  };

  // Navigate to section programmatically
  const goToSection = async (section: number) => {
    if (section >= 0 && section <= 2) {
      await handleUpdateSection(section);
      await impactFeedback('soft');
    }
  };

  useEffect(() => {
    const checkNotificationPermission = async () => {
      // Do you have permission to send a notification?
      let permissionGranted = await isPermissionGranted();

      // If not we need to request it
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
    };
    checkNotificationPermission();
  }, []);
  return (
    <main
      ref={mainRef}
      className="h-dvh overflow-hidden relative bg-muted"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      vaul-drawer-wrapper="true"
    >
      <Onboard />
      <Suspense>
        {/* Navigation dots */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => goToSection(idx)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                activeSection === idx ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              )}
              aria-label={`Go to section ${idx + 1}`}
            />
          ))}
        </div>

        {/* Left/Right navigation buttons (shown on larger screens) */}
        <div className="hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-70 hover:opacity-100',
              activeSection === 0 && 'opacity-0 pointer-events-none'
            )}
            onClick={() => goToSection(activeSection - 1)}
            disabled={activeSection === 0}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-70 hover:opacity-100',
              activeSection === 2 && 'opacity-0 pointer-events-none'
            )}
            onClick={() => goToSection(activeSection + 1)}
            disabled={activeSection === 2}
          >
            <ChevronRight />
          </Button>
        </div>

        {/* Swipeable sections container */}
        <div
          className={cn(
            'flex transition-transform duration-300 ease-out h-full',
            isSwiping && 'transition-none',
            activeSection === 0 && 'translate-x-0',
            activeSection === 1 && '-translate-x-[100vw]',
            activeSection === 2 && '-translate-x-[200vw]'
          )}
          style={{ width: '300vw' }}
        >
          {/* Section 1: Home */}
          <section className="w-screen h-full px-4 py-16 flex flex-col">
            <div className="flex flex-col items-center justify-center mt-6 px-6">
              <Profile />
              <MyGreetingMessage />
            </div>
          </section>

          {/* Section 2: Challenge */}
          <section className="w-screen h-full px-4 py-16 overflow-y-auto">
            <div className="space-y-6 max-w-lg mx-auto px-6">
              <Challenge />
            </div>
          </section>

          {/* Section 3: Chat */}
          <section className="w-screen h-full px-4 py-16 overflow-y-auto">
            <div className="space-y-6 max-w-lg mx-auto">
              <Chat />
            </div>
          </section>
        </div>
      </Suspense>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0  flex justify-around p-2 z-20 gap-4 max-w-lg mx-auto">
        <Button
          variant={activeSection === 0 ? 'default' : 'ghost'}
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 w-full"
          onClick={() => goToSection(0)}
        >
          <Image
            width={120}
            height={120}
            src="/photos/image-mesh-gradient-1.png"
            alt="Home"
            className="w-6 h-6 rounded-full mx-auto inline-flex "
          />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant={activeSection === 1 ? 'default' : 'ghost'}
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 w-full"
          onClick={() => goToSection(1)}
        >
          <Image
            width={120}
            height={120}
            src="/photos/image-mesh-gradient-2.png"
            alt="Challenge"
            className="w-6 h-6 rounded-full mx-auto inline-flex "
          />
          <span className="text-xs">Challenge</span>
        </Button>
        <Button
          variant={activeSection === 2 ? 'default' : 'ghost'}
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 w-full"
          onClick={() => goToSection(2)}
        >
          <Image
            width={120}
            height={120}
            src="/photos/image-mesh-gradient-3.png"
            alt="Chat"
            className="w-6 h-6 rounded-full mx-auto inline-flex "
          />
          <span className="text-xs">Chat</span>
        </Button>
      </nav>

      <div className="fixed top-0 left-0 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {
            if (isMounted) {
              window.location.reload();
            }
            impactFeedback('soft');
          }}
        >
          <Image
            src="/logo.png"
            alt="Mono Mode"
            width={48}
            height={48}
            className="brightness-100 invert-0 dark:brightness-0 dark:invert"
            priority
          />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
      {/* Settings drawer in fixed position */}
      <div className="fixed top-0 right-0 p-4">
        <SettingsDrawer />
      </div>
    </main>
  );
}
