import Image from 'next/image';

export function Avatar({ name }: { name: string }) {
  return (
    <Image
      src={`/avatars/${name}.png`}
      alt={name}
      fill
      className="aspect-square absolute inset-0 w-full h-full object-cover"
    />
  );
}
