'use client';

import { useIsMounted } from '@/hooks/use-is-mounted';
import { User } from '@/lib/types';
import { Store } from '@tauri-apps/plugin-store';
import { useTheme } from 'next-themes';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface StoreContextType {
  handleUpdateTheme: (theme: string) => Promise<void>;
  activeSection: number;
  handleUpdateSection: (section: number) => Promise<void>;
  user: User | null;
  handleUpdateUser: (user: User) => Promise<void>;
  isLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted();
  const { setTheme } = useTheme();
  const [activeSection, setSection] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize store
  useEffect(() => {
    if (!isMounted) return;

    const initStore = async () => {
      try {
        const storeInstance = await Store.load('store.json', { autoSave: false });

        // Load initial values
        const themeData = await storeInstance.get<{ value: string }>('theme');
        const userData = await storeInstance.get<{ value: User }>('user');
        const sectionData = await storeInstance.get<{ value: number }>('section');

        if (themeData?.value) {
          setTheme(themeData.value);
        }

        if (sectionData?.value) {
          setSection(sectionData.value);
        }

        if (userData?.value) {
          setUser(userData.value);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing store:', error);
        setIsLoaded(true); // Still mark as loaded so the app can function
      }
    };

    initStore();
  }, [isMounted, setTheme, setUser]);

  // Functions to update values
  const handleUpdateTheme = async (newTheme: string) => {
    try {
      const storeInstance = await Store.load('store.json', { autoSave: false });

      // Update the store
      await storeInstance.set('theme', { value: newTheme });
      await storeInstance.save();

      // Update local state
      setTheme(newTheme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const handleUpdateUser = async (newUser: User) => {
    try {
      const storeInstance = await Store.load('store.json', { autoSave: false });

      // Update the store
      await storeInstance.set('user', { value: newUser });
      await storeInstance.save();

      // Update local state
      setUser(newUser);
    } catch (error) {
      console.error('Error setting user:', error);
    }
  };
  const handleUpdateSection = async (newSection: number) => {
    try {
      const storeInstance = await Store.load('store.json', { autoSave: false });
      // Update the store
      await storeInstance.set('section', { value: newSection });
      await storeInstance.save();
      // Update local state
      setSection(newSection);
    } catch (error) {
      console.error('Error setting section:', error);
    }
  };
  return (
    <StoreContext.Provider
      value={{
        handleUpdateTheme,
        user,
        handleUpdateUser,
        activeSection,
        handleUpdateSection,
        isLoaded
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
}
