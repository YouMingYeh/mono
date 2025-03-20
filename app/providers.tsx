'use client';

import { StoreProvider } from '@/hooks/use-store';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Providers({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <StoreProvider>{children}</StoreProvider>
    </NextThemesProvider>
  );
}
