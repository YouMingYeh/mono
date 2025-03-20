'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-muted flex items-center justify-center animate-fade-in">
      <div className="m-auto">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.svg"
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
          <p className="text-sm text-muted-foreground text-center">
            Change your life by making small daily decisions and staying focused, <br />
            in just 5 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
