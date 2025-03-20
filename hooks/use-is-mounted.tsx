import * as React from 'react';

export function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    setIsMounted(true);
  }, []);

  return isMounted;
}
