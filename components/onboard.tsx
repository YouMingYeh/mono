'use client';

import { Avatar } from './avatar';
import { AvatarSelect } from './avatar-select';
import { CreateChellengeDrawer } from './create-challenge-drawer';
import { ExploreChellengeDrawer } from './explore-challenge-drawer';
import { Input } from './ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger
} from '@/components/ui/stepper';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  CircleChevronLeft,
  CircleChevronRight,
  CirclePlus,
  Telescope
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const steps = [1, 2, 3, 4];

export function Onboard() {
  const { user, handleUpdateUser, isLoaded } = useStore();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('anon');

  const handleClick = () => {
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: { x: 0.5, y: 0.5 }
    });
  };

  useEffect(() => {
    if (isLoaded && !user) {
      setOpen(true);
    }
  }, [isLoaded, user]);

  return (
    <main className="flex w-full items-center justify-between my-4">
      <Dialog open={open}>
        <DialogContent
          className="flex flex-col gap-0 max-h-[100vh] max-w-none rounded-none h-screen py-24 bg-muted border-none [&>button:last-child]:top-3.5"
          hideCloseButton
        >
          <DialogHeader className="contents space-y-0 text-center">
            <DialogTitle className="px-6 py-4 ">Welcome 👋</DialogTitle>
          </DialogHeader>
          <div className="mx-auto max-w-xl space-y-8 text-center h-full py-8 w-full px-10">
            <Stepper value={currentStep} onValueChange={setCurrentStep}>
              {steps.map((step) => (
                <StepperItem
                  key={step}
                  step={step}
                  className={cn('not-last:flex-1', step <= currentStep ? '' : 'opacity-0')}
                >
                  <StepperTrigger asChild>
                    <StepperIndicator />
                  </StepperTrigger>
                  {step < steps.length && <StepperSeparator />}
                </StepperItem>
              ))}
            </Stepper>
            {currentStep === 1 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <Image
                  src="/logo.png"
                  alt="Mono Mode"
                  width={96}
                  height={96}
                  className="brightness-100 invert-0 dark:brightness-0 dark:invert rounded-3xl border bg-background"
                  priority
                />
                <h2 className="text-2xl font-extrabold">Mono</h2>
                <p className="font-semibold leading-0">30 day challenge</p>
                <br />
                <p className="text-muted-foreground">
                  The Only One App You Need to Learn or Build Anything
                </p>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <h2 className="text-2xl font-semibold">First,</h2>
                <p className="font-semibold leading-0">How should we call you?</p>
                <br />
                <Input
                  value={name}
                  placeholder="Enter it here"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-24 bg-background text-center text-xl overflow-auto"
                />
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <h2 className="text-2xl font-semibold">Second,</h2>
                <p className="font-semibold leading-0">Choose your avatar</p>
                <br />
                <div className="relative w-36 h-36 border rounded-full bg-background ">
                  <AvatarSelect trigger={<Avatar name={avatar || 'anon'} />} onSelect={setAvatar} />
                </div>
                <p className="text-muted-foreground text-xs">
                  Oh, BTW, you can always change your name and avatar in the settings.
                </p>
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <h2 className="text-2xl font-semibold">
                  Nice to meet you, <span className="font-extrabold">{name}</span>!
                </h2>
                <br />
                <p className="font-semibold">
                  First things first, let&apos;s <u>Make a Challenge</u>. So, would you like to
                </p>
                <br />
                <CreateChellengeDrawer
                  trigger={
                    <Button variant="secondary" className="w-full gap-2">
                      <span className="text-sm font-semibold">Create Yourself</span>
                      <CirclePlus size={14} />
                    </Button>
                  }
                />

                <ExploreChellengeDrawer
                  trigger={
                    <Button variant="secondary" className="w-full gap-2">
                      <span className="text-sm font-semibold">Explore</span>
                      <Telescope size={14} />
                    </Button>
                  }
                />

                <br />
                <p className="text-muted-foreground text-xs">
                  You can always create a challenge later.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="px-6 py-4 sm:items-center">
            <div className="flex w-full gap-2 ">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="w-full gap-2"
                hidden={currentStep === 1}
              >
                Prev
                <CircleChevronLeft size={14} />
              </Button>
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="w-full gap-2"
                hidden={currentStep > steps.length}
                disabled={currentStep === 2 && !name.length}
              >
                {currentStep === 1 ? 'Get Started' : 'Next'}
                <CircleChevronRight size={14} />
              </Button>

              <Button
                onClick={() => {
                  setOpen(false);
                  handleClick();
                }}
                effect="shine"
                className="w-full gap-2"
                hidden={currentStep <= steps.length}
              >
                Finish
                <CheckCircle size={14} />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
