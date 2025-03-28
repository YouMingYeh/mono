import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState, useCallback } from 'react';

export type Avatar = {
  id: string;
  src: string;
  alt: string;
};

export type AvatarSelectProps = {
  trigger: React.ReactNode;
  avatars?: Avatar[];
  selectedAvatarId?: string;
  onSelect?: (avatarId: string) => void;
  title?: string;
  className?: string;
};

const DEFAULT_AVATARS: Avatar[] = [
  { id: 'mo', src: '/avatars/mo.png', alt: 'Mo Avatar' },
  { id: 'cat', src: '/avatars/cat.png', alt: 'Cat Avatar' },
  { id: 'dog', src: '/avatars/dog.png', alt: 'Dog Avatar' },
  { id: 'bird', src: '/avatars/bird.png', alt: 'Bird Avatar' },
  { id: 'rabbit', src: '/avatars/rabbit.png', alt: 'Rabbit Avatar' },
  { id: 'anon', src: '/avatars/anon.png', alt: 'Anon Avatar' },
  ...Array.from({ length: 7 }, (_, index) => ({
    id: `boy-${index + 1}`,
    src: `/avatars/boy-${index + 1}.png`,
    alt: `Boy Avatar ${index + 1}`
  })),
  ...Array.from({ length: 12 }, (_, index) => ({
    id: `girl-${index + 1}`,
    src: `/avatars/girl-${index + 1}.png`,
    alt: `Girl Avatar ${index + 1}`
  }))
];

export function AvatarSelect({
  trigger,
  avatars = DEFAULT_AVATARS,
  selectedAvatarId,
  onSelect,
  title = 'Select your avatar',
  className
}: AvatarSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedAvatarId);

  const handleSelect = useCallback(
    async (id: string) => {
      setSelectedId(id);
      await onSelect?.(id);
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className={cn('w-full h-full max-h-[80svh] overflow-auto', className)}>
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
        </DrawerHeader>

        <div className="grid grid-cols-3 gap-6 p-6 h-full overflow-auto">
          {avatars.map((avatar) => (
            <AvatarOption
              key={avatar.id}
              avatar={avatar}
              isSelected={avatar.id === selectedId}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <DrawerFooter>
          <DrawerClose className="w-full" asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type AvatarOptionProps = {
  avatar: Avatar;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

function AvatarOption({ avatar, isSelected, onSelect }: AvatarOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(avatar.id)}
      className={cn(
        'relative w-24 h-24 rounded-full overflow-hidden transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'hover:scale-105',
        isSelected && 'ring-2'
      )}
      aria-label={`Select ${avatar.alt}`}
      aria-pressed={isSelected}
    >
      <div className="relative w-full h-full">
        <Image
          src={avatar.src}
          alt={avatar.alt}
          fill
          sizes="96px"
          priority={isSelected}
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/avatars/default.png';
          }}
        />
      </div>
    </button>
  );
}
