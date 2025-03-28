'use client';

import { Avatar } from './avatar';
import { AvatarSelect } from './avatar-select';
import { useStore } from '@/hooks/use-store';

export function Profile() {
  const { user, handleUpdateUser } = useStore();
  const handleUpdateAvatar = async (avatar: string) => {
    if (!user) return;
    await handleUpdateUser({ ...user, avatar });
  };
  return (
    <main className="flex w-full items-center justify-between my-4">
      <header>
        <h1 className="text-4xl font-bold font-mono tabular-nums tracking-tight leading-16">
          <span className="text-primary">Hello</span>
        </h1>
      </header>
      <div className="relative w-24 h-24 rounded-full">
        <AvatarSelect
          trigger={<Avatar name={user?.avatar || 'anon'} />}
          onSelect={handleUpdateAvatar}
        />
      </div>
    </main>
  );
}
