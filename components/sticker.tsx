import Image from 'next/image';

export function Sticker({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center relative w-full h-full">
      <Image
        src={`/avatars/${name}.png`}
        alt={name}
        fill
        className="aspect-square absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
