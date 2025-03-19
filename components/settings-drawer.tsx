'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { impactFeedback } from '@tauri-apps/plugin-haptics';
import { Store } from '@tauri-apps/plugin-store';
import { Check, MoonIcon, Settings, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('sans');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const onSave = async () => {
    try {
      const store = await Store.load('store.json', { autoSave: false });
      await store.set('theme', { value: theme === 'dark' ? 'dark' : 'light' });
      await store.save();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await Store.load('store.json', { autoSave: false });
        const value = await store.get<{ value: string }>('theme');
        if (value?.value) {
          setTheme(value.value);
          document.documentElement.classList.toggle(value.value);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    fetchData();
  }, []);

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      await onSave();
    }
    setOpen(open);
    await impactFeedback('soft');
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="h-full flex flex-col pb-32">
          <DrawerHeader className="px-6 ">
            <DrawerTitle className="text-lg font-medium">Settings</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-auto">
            <div className="px-6 py-4">
              <div className="space-y-6">
                {/* Theme */}
                <Label className="text-sm font-medium">Theme</Label>
                <div>
                  <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                    <Switch
                      id={'theme'}
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      className="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
                    />
                    <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center">
                      <MoonIcon size={16} aria-hidden="true" />
                    </span>
                    <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
                      <SunIcon size={16} aria-hidden="true" />
                    </span>
                  </div>
                  <Label htmlFor={'theme'} className="sr-only">
                    Labeled switch
                  </Label>
                </div>

                <Separator hidden />

                {/* Font */}
                <div className="space-y-3 hidden">
                  <Label className="text-sm font-medium">Font</Label>
                  <RadioGroup
                    value={font}
                    onValueChange={setFont}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sans" id="sans" className="peer sr-only" />
                      <Label
                        htmlFor="sans"
                        className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="font-sans">Sans-serif</div>
                        {font === 'sans' && <Check className="h-4 w-4" />}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="serif" id="serif" className="peer sr-only" />
                      <Label
                        htmlFor="serif"
                        className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="font-serif">Serif</div>
                        {font === 'serif' && <Check className="h-4 w-4" />}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mono" id="mono" className="peer sr-only" />
                      <Label
                        htmlFor="mono"
                        className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="font-mono">Monospace</div>
                        {font === 'mono' && <Check className="h-4 w-4" />}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator hidden />

                {/* Language */}
                <div className="space-y-3 hidden">
                  <Label htmlFor="language" className="text-sm font-medium">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator hidden />

                {/* Timezone */}
                <div className="space-y-3 hidden">
                  <Label htmlFor="timezone" className="text-sm font-medium">
                    Timezone
                  </Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="CST">Central Time (CST)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="CET">Central European Time (CET)</SelectItem>
                      <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
