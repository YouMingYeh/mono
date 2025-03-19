'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

interface BorderlessCarouselProps {
  childrens: {
    id: string;
    component: React.ReactNode;
  }[];
  autoplay?: boolean;
  interval?: number; // in milliseconds
  pauseOnHover?: boolean;
}

export function BorderlessCarousel({
  childrens,
  autoplay = true,
  interval = 10000,
  pauseOnHover = true
}: BorderlessCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);

  // Center the first slide when the component mounts
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [api]);

  // Set up autoplay functionality
  useEffect(() => {
    if (!api || !autoplay) return;

    let intervalId: NodeJS.Timeout;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (!isPaused) {
          api.scrollNext();
        }
      }, interval);
    };

    startAutoplay();

    // Clean up interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [api, autoplay, interval, isPaused]);

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 py-8">
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        className="w-full"
        setApi={setApi}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {childrens.map((children) => (
            <CarouselItem
              key={children.id}
              className="pl-2 md:pl-4 flex items-center justify-center"
            >
              {children.component}
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between gap-2 mt-4">
          {/* <CarouselPrevious className="static transform-none" onClick={() => setIsPaused(true)} />
          <CarouselNext className="static transform-none" onClick={() => setIsPaused(true)} /> */}
        </div>
      </Carousel>
    </div>
  );
}
