export type Task = {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TaskCreate = {
  title: string;
  time: string;
};

export type TaskUpdate = {
  id: string;
  title?: string;
  time?: string;
  completed?: boolean;
};

export interface MoodData {
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'low' | 'bad';
  energy: 'high' | 'medium' | 'low';
}

export interface ReflectionData {
  date: string;
  content: string;
  prompt: string;
}

export type Mood = 'great' | 'good' | 'neutral' | 'low' | 'bad';
export type Energy = 'high' | 'medium' | 'low';
