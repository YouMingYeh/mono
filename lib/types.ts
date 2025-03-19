export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

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
