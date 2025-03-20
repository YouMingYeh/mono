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

export type Mood = {
  id: string;
  date: string;
  mood: MoodType;
  energy: Energy;
  created_at: string;
  updated_at: string;
};

export type MoodCreate = {
  date: string;
  mood: MoodType;
  energy: Energy;
};
export type MoodUpdate = {
  id: string;
  date?: string;
  mood?: MoodType;
  energy?: Energy;
};

export type MoodType = 'great' | 'good' | 'neutral' | 'low' | 'bad';
export type Energy = 'high' | 'medium' | 'low';
