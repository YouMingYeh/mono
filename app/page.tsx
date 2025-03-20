'use client';

import Loading from './loading';
import Main from './main';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);
  if (isLoading) {
    return <Loading key="loading" />;
  }
  return <Main />;
}
