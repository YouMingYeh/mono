'use client';

import { Mood, MoodCreate, MoodUpdate, Task, TaskCreate, TaskUpdate } from './types';
import Database from '@tauri-apps/plugin-sql';
import { v4 } from 'uuid';

// Use a singleton pattern for database connection
let db: Database | null = null;

// Initialize database connection
async function getDb() {
  if (!db) {
    try {
      db = await Database.load('sqlite:main.db');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
  return db;
}

// Task Operations
export async function getTasks() {
  const database = await getDb();
  const rows = (await database.select('SELECT * FROM task')) as Task[];
  return rows;
}

export async function createTask(task: TaskCreate) {
  const database = await getDb();
  const { title, time } = task;
  const id = v4();
  const now = new Date().toISOString();

  await database.execute(
    'INSERT INTO task (id, title, time, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, time, 0, now, now]
  );

  const rows = (await database.select('SELECT * FROM task WHERE id = ?', [id])) as Task[];
  return rows[0];
}

export async function updateTask(task: TaskUpdate) {
  const database = await getDb();
  const { id, title, time, completed } = task;

  await database.execute(
    'UPDATE task SET title = ?, time = ?, completed = ?, updated_at = ? WHERE id = ?',
    [title, time, completed, new Date().toISOString(), id]
  );

  const rows = (await database.select('SELECT * FROM task WHERE id = ?', [id])) as Task[];
  return rows[0];
}

export async function deleteTask(id: string) {
  const database = await getDb();
  await database.execute('DELETE FROM task WHERE id = ?', [id]);
  return id;
}

// Mood Operations
export async function getMoods() {
  const database = await getDb();
  const rows = (await database.select('SELECT * FROM mood')) as Mood[];
  return rows;
}

export async function createMood(mood: MoodCreate) {
  const database = await getDb();
  const { date, mood: moodType, energy } = mood;
  const id = v4();
  const now = new Date().toISOString();

  await database.execute(
    'INSERT INTO mood (id, date, mood, energy, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, date, moodType, energy, now, now]
  );

  const rows = (await database.select('SELECT * FROM mood WHERE id = ?', [id])) as Mood[];
  return rows[0];
}

export async function updateMood(mood: MoodUpdate) {
  const database = await getDb();
  const { id, date, mood: moodType, energy } = mood;
  const now = new Date().toISOString();

  await database.execute(
    'UPDATE mood SET date = ?, mood = ?, energy = ?, updated_at = ? WHERE id = ?',
    [date, moodType, energy, now, id]
  );

  const rows = (await database.select('SELECT * FROM mood WHERE id = ?', [id])) as Mood[];
  return rows[0];
}

export async function deleteMood(id: string) {
  const database = await getDb();
  await database.execute('DELETE FROM mood WHERE id = ?', [id]);
  return id;
}
