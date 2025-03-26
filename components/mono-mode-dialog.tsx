'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { impactFeedback, notificationFeedback } from '@tauri-apps/plugin-haptics';
import { sendNotification } from '@tauri-apps/plugin-notification';
import confetti from 'canvas-confetti';
import { RotateCcw, RotateCw } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function MonoModeDialog() {
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setIsLandscape] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0); // Track manual rotation

  // Pomodoro states
  const [countdownTime, setCountdownTime] = useState(25 * 60); // 25 minutes in seconds
  const [isBreakTime, setIsBreakTime] = useState(false);

  // 5 Second Rule states
  const [isInitialCountdown, setIsInitialCountdown] = useState(false);
  const [initialCount, setInitialCount] = useState(5);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  // Detect device orientation
  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      // Trigger animation at the start of each minute
      if (now.getSeconds() === 0) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 5 Second Rule countdown effect
  useEffect(() => {
    let initialCountdownInterval: NodeJS.Timeout;

    if (open && isInitialCountdown) {
      initialCountdownInterval = setInterval(async () => {
        setInitialCount((prev) => {
          if (prev <= 1) {
            // When countdown reaches 0, start the session
            setIsInitialCountdown(false);
            setIsSessionStarted(true);

            // Trigger haptic feedback
            impactFeedback('medium');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (initialCountdownInterval) clearInterval(initialCountdownInterval);
    };
  }, [open, isInitialCountdown]);

  // Pomodoro countdown effect with async notifications
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (open && isSessionStarted && !isBreakTime) {
      countdownInterval = setInterval(() => {
        setCountdownTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [open, isSessionStarted, isBreakTime]);

  // Notify when countdown ends
  useEffect(() => {
    if (open && isSessionStarted && !isBreakTime && countdownTime === 0) {
      (async () => {
        sendNotification({ title: 'Mono', body: 'Time to take a break!' });
        playFireworks();
        await notificationFeedback('warning');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await notificationFeedback('warning');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await notificationFeedback('warning');
        setIsBreakTime(true);
      })();
    }
  }, [countdownTime, open, isSessionStarted, isBreakTime]);

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

  // Get current date information
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

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    await impactFeedback('soft');

    if (isOpen) {
      // Restart countdown when dialog opens
      setCountdownTime(25 * 60);
      setIsBreakTime(false);
      setIsSessionStarted(false);
      setInitialCount(5);
      setIsInitialCountdown(true);
    }
  };

  const resetCountdown = async () => {
    setCountdownTime(25 * 60);
    setIsBreakTime(false);
    setIsSessionStarted(false);
    setInitialCount(5);
    setIsInitialCountdown(true);
    await impactFeedback('medium');
  };

  const startSession = async () => {
    setIsInitialCountdown(true);
    await impactFeedback('soft');
  };

  // Handle manual rotation
  const handleRotateScreen = async () => {
    // Rotate in 90-degree increments (0 -> 90 -> 180 -> 270 -> 0)
    setRotationDegrees((prev) => (prev + 90) % 360);
    await impactFeedback('soft');
  };

  const playFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        zIndex: 51
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        zIndex: 51
      });
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="shine" size="lg">
          <Image
            src="/logo.svg"
            alt="Mono Mode"
            width={24}
            height={24}
            className="brightness-0 invert mr-2 dark:brightness-100 dark:invert-0 animate-pulse font-bold"
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
          {/* Content container with manual rotation */}
          <div
            className="relative flex flex-col items-center justify-center transition-all duration-300"
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              width: rotationDegrees % 180 === 0 ? '100%' : '100dvh',
              height: rotationDegrees % 180 === 0 ? '100%' : '100dvw',
              transformOrigin: 'center'
            }}
          >
            {/* Content */}
            <Image
              src="/logo.svg"
              alt="Mono Mode"
              width={40}
              height={40}
              className="brightness-100 invert-0 dark:brightness-0 dark:invert"
              priority
            />
            <div className="relative z-10 w-full">
              {/* Display date */}
              <div className="flex text-lg font-medium justify-center">
                <div>
                  <span className="text-muted-foreground">{formattedDay}</span>
                </div>
              </div>

              {/* Clock display */}
              <div
                className={cn(
                  'text-8xl font-bold tracking-tighter transition-all duration-700 ease-in-out text-center text-nowrap',
                  isAnimating ? 'scale-105 text-foreground' : ''
                )}
              >
                <NumberFlow format={{ minimumIntegerDigits: 2 }} value={hours} />:
                <NumberFlow format={{ minimumIntegerDigits: 2 }} value={Number(minutes)} />
              </div>

              {/* 5 Second Rule countdown or Pomodoro countdown */}
              <div className="text-xl font-medium mt-8 text-center transition-all space-y-4">
                {isInitialCountdown ? (
                  <div className="space-y-2">
                    <p className="text-primary">Take a deep breath...</p>
                    <p className="text-sm text-muted-foreground mt-1">we will start in </p>
                    <div className="text-4xl font-bold animate-pulse">
                      <NumberFlow value={initialCount} className="text-primary" />
                    </div>
                  </div>
                ) : isBreakTime ? (
                  <div className="text-primary font-bold animate-pulse">Break time!</div>
                ) : !isSessionStarted ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Ready to focus?</p>
                    <Button onClick={startSession} size="lg">
                      Start 25-minute Focus Session
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Focus session:{' '}
                    <span className="text-primary">{formatCountdown(countdownTime)}</span>
                  </div>
                )}
              </div>

              {(isSessionStarted || isBreakTime) && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" onClick={resetCountdown}>
                    <RotateCcw size={16} className="mr-2" />
                    Reset Timer
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Rotation button - fixed position in bottom right corner */}
          <div className="absolute bottom-4 right-4 z-50">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full h-8 w-8"
              onClick={handleRotateScreen}
            >
              <RotateCw size={14} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
