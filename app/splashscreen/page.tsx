import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SplashScreen() {
  // random number from 1 to 3
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  const randomPhotoSrc = `/photos/image-mesh-gradient-${randomNumber}.png`;
  const randomPhotoAlt = `Mesh gradient ${randomNumber}`;
  const { push } = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      push('/');
    }, 2000); // 2 seconds

    return () => clearTimeout(timeout);
  }, [push]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-500">
      <Image
        src={randomPhotoSrc}
        alt={randomPhotoAlt}
        fill
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      <div className="relative flex flex-col gap-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-[5rem]">Splash Screen</h1>
        <p className="text-lg text-muted-foreground">
          This is a splash screen with a random mesh gradient background.
        </p>
      </div>
    </main>
  );
}
