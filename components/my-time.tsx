'use client';

import { useState, useEffect } from 'react';

export function MyTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (is24Hour) {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <main
      className="flex flex-col items-center justify-center my-4"
      onClick={() => setIs24Hour(!is24Hour)}
    >
      <h1 className="text-6xl font-light font-mono tabular-nums tracking-tight ">
        {formatTime(currentTime)}
      </h1>
    </main>
  );
}
