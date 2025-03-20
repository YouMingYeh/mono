'use client';

import { AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { impactFeedback, selectionFeedback } from '@tauri-apps/plugin-haptics';
import { Store } from '@tauri-apps/plugin-store';
import { PlusIcon, ClockIcon, TrashIcon, ChevronRight } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(new Date().toISOString().substring(11, 16));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load saved tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  // Get the first incomplete task for the header
  const currentFocusTask = sortedTasks.find((task) => !task.completed);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTaskItem: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        time: newTaskTime,
        completed: false
      };
      setTasks([newTaskItem, ...tasks]);
      setNewTaskTitle('');
      setNewTaskTime('');
      setDrawerOpen(false);
    } else {
      toast.error('Please enter a task title.');
    }
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await selectionFeedback();
  };

  const removeTask = async (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    await impactFeedback('heavy');
  };

  useEffect(() => {
    const saveTasks = async () => {
      if (typeof window !== 'undefined') {
        return;
      }
      try {
        const store = await Store.load('store.json', { autoSave: false });
        await store.set('tasks', { value: tasks });
        await store.save();
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    };
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      return;
    }
    const fetchData = async () => {
      try {
        const store = await Store.load('store.json', { autoSave: false });
        const value = await store.get<{ value: Task[] }>('tasks');
        if (value) {
          const tasks = value.value;
          setTasks(tasks);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <AccordionItem value="task" className="py-2">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="group focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
          <span className="flex items-center gap-3">
            <CircleCheckBig
              size={16}
              className="shrink-0 opacity-60 group-data-[state=open]:opacity-100
                group-data-[state=open]:text-emerald-500 transition-all duration-200"
              aria-hidden="true"
            />
            <span>
              <span>
                {currentFocusTask ? (
                  <strong className="italic underline">{currentFocusTask.title}</strong>
                ) : (
                  'No focus task set'
                )}
              </span>{' '}
              <span className="italic text-primary">
                {tasks.length > 0
                  ? `(${tasks.filter((t) => t.completed).length}/${tasks.length})`
                  : ''}
              </span>
            </span>
          </span>
          <PlusIcon
            size={16}
            className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent className="pt-2 pb-8">
        <div className="space-y-4 p-1">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                <PlusIcon size={14} className="mr-1" /> Add Task
              </Button>
            </DrawerTrigger>
            <DrawerContent className=" max-h-none h-[80svh] ">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-normal">Add a task</DrawerTitle>
                <DrawerDescription className="text-sm text-muted-foreground">
                  Add a new task to your list.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-6 py-4 space-y-6">
                <div className="space-y-3">
                  <Input
                    id="title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Type a task name..."
                    className="w-full border-none bg-transparent px-0 !text-xl h-12 placeholder:text-muted-foreground/50 focus-visible:ring-0 font-bold focus-visible:ring-offset-0 shadow-none"
                  />
                  <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                    <ChevronRight size={14} className="inline-flex mr-1" />
                    What do you want to accomplish?
                  </label>
                </div>
                <div className="space-y-3">
                  <Input
                    id="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    type="time"
                    className="w-full border-none bg-transparent px-0 !text-xl font-bold h-12 placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
                  <label
                    htmlFor="time"
                    className="text-sm font-medium text-muted-foreground flex items-center gap-2"
                  >
                    <ClockIcon size={14} />
                    When do you need to finish?
                  </label>
                </div>
              </div>
              <DrawerFooter>
                <Button onClick={addTask} className="w-full">
                  Add Task
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <div className="mt-2 space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg border-muted">
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Add one to get started.</p>
              </div>
            ) : (
              sortedTasks.map((task) => (
                <Button
                  key={task.id}
                  className={`p-3 rounded-lg w-full   transition-all duration-200  ${
                    !task.completed ? 'bg-background ' : 'opacity-75'
                  }`}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        id={`task-${task.id}`}
                        className="h-5 w-5"
                        style={
                          {
                            '--primary': 'var(--color-emerald-500)'
                          } as React.CSSProperties
                        }
                      />
                      <div className="cursor-pointer flex-1">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-base font-medium transition-all ${task.completed ? 'line-through opacity-70' : ''}`}
                        >
                          {task.title}
                        </label>
                      </div>
                      {task.time && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground gap-1">
                          <ClockIcon size={12} />
                          <span>{task.time}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(task.id);
                      }}
                      className="opacity-70 h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove task"
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
