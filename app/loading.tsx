'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [loadedSlogan, setLoadedSlogan] = useState('');
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SLOGANS.length);
    setLoadedSlogan(SLOGANS[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 z-100 bg-muted flex items-center justify-center animate-fade-in px-8">
      <div className="m-auto">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Mono Mode"
            width={120}
            height={120}
            className="w-24 h-24 rounded-full mx-auto inline-flex animate-spin ease-in-out duration-2000"
          />
        </div>
        <div className="flex items-center justify-center mt-4">
          <h2 className="text-xl font-semibold text-center">Mono</h2>
        </div>
        <div className="flex items-center justify-center mt-2">
          <p className="text-sm text-muted-foreground text-center">{loadedSlogan}</p>
        </div>
      </div>
    </div>
  );
}

const SLOGANS = [
  'Transform Yourself, One Day at a Time',
  '30 Days to a Better You',
  'One Month to Mastery',
  'Small Steps, Big Impact',
  'Realize Your Potential in 30 Days'
];
