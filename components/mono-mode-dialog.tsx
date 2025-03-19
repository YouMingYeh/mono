'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { impactFeedback, notificationFeedback } from '@tauri-apps/plugin-haptics';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function MonoModeDialog() {
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  // Pomodoro states
  const [countdownTime, setCountdownTime] = useState(25 * 60); // 25 minutes in seconds
  const [isBreakTime, setIsBreakTime] = useState(false);

  // Detect device orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      // Trigger animation every minute
      if (now.getSeconds() === 0) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pomodoro countdown effect with awaitable notifications
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (open && !isBreakTime) {
      countdownInterval = setInterval(() => {
        setCountdownTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [open, isBreakTime]);

  // When the countdown finishes, trigger async notifications
  useEffect(() => {
    if (open && !isBreakTime && countdownTime === 0) {
      (async () => {
        sendNotification({ title: 'Mono', body: 'Time for a break!' });
        await notificationFeedback('warning');
        setIsBreakTime(true);
      })();
    }
  }, [countdownTime, open, isBreakTime]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time as HH:MM
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Get day and date
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const day = days[time.getDay()];
  const date = time.getDate();
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];
  const month = months[time.getMonth()];
  const year = time.getFullYear();
  const formattedDate = `${month} ${date}, ${year}`;
  const formattedDay = `${day}, ${formattedDate}`;

  const handleOpenChange = async (open: boolean) => {
    setOpen(open);
    await impactFeedback('soft');

    if (open) {
      // Reset and start countdown when dialog opens
      setCountdownTime(25 * 60);
      setIsBreakTime(false);
    }
  };

  const resetCountdown = async () => {
    setCountdownTime(25 * 60);
    setIsBreakTime(false);
    await impactFeedback('medium');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="shine">
          <Image
            src="/logo.svg"
            alt="Mono Mode"
            width={24}
            height={24}
            className="brightness-0 invert mr-2 dark:brightness-100 dark:invert-0"
            priority
          />
          Mono Mode
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-0 !h-[100dvh] !max-w-none !w-[100dvw] flex items-center justify-center rounded-none overflow-hidden">
        <DialogTitle className="sr-only">
          {day} {date} {hours}:{minutes}:{seconds}
        </DialogTitle>

        <div className="relative flex items-center justify-center w-full h-full">
          {/* Container with adaptive sizing based on orientation */}
          <div
            className={cn(
              'relative flex flex-col items-center justify-center transition-all duration-300',
              isLandscape
                ? 'w-full h-full'
                : 'w-[100dvh] h-[100dvw] transform rotate-90 origin-center'
            )}
          >
            {/* Content container */}
            <Image
              src="/logo.svg"
              alt="Mono Mode"
              width={40}
              height={40}
              className="brightness-100 invert-0 dark:brightness-0 dark:invert"
              priority
            />
            <div className="relative z-10 w-full">
              {/* Top row with date */}
              <div className="flex text-lg font-medium justify-center">
                <div>
                  <span className="text-muted-foreground ">{formattedDay}</span>
                </div>
              </div>

              {/* Main time display */}
              <div
                className={cn(
                  'text-8xl font-bold tracking-tighter transition-all duration-700 ease-in-out text-center text-nowrap',
                  isAnimating ? 'scale-105 text-foreground' : ''
                )}
              >
                <NumberFlow format={{ minimumIntegerDigits: 2 }} value={hours} />:
                <NumberFlow format={{ minimumIntegerDigits: 2 }} value={Number(minutes)} />
              </div>

              {/* Pomodoro countdown */}
              <div className="text-xl font-medium mt-4 text-center transition-all">
                {isBreakTime ? (
                  <div className="text-primary font-bold animate-pulse">Time for a break!</div>
                ) : (
                  <div className="text-muted-foreground">
                    Focus time:{' '}
                    <span className="text-primary">{formatCountdown(countdownTime)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={resetCountdown}>
                  <RotateCcw size={16} className="mr-2" />
                  Reset Timer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
