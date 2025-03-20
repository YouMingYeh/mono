'use client';

import { Task, TaskCreate, TaskUpdate } from './types';
import Database from '@tauri-apps/plugin-sql';
import { v4 } from 'uuid';

const db = await Database.load('sqlite:main.db');

export async function getTasks() {
  const rows = (await db.select('SELECT * FROM task')) as Task[];
  return rows;
}

export async function createTask(task: TaskCreate) {
  const { title, time } = task;
  await db.execute(
    'INSERT INTO task (id, title, time, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [v4(), title, time, 0, new Date().toISOString(), new Date().toISOString()]
  );
  const rows = (await db.select('SELECT * FROM task WHERE title = ? AND time = ?', [
    title,
    time
  ])) as Task[];
  return rows[0];
}
export async function updateTask(task: TaskUpdate) {
  const { id, title, time, completed } = task;
  await db.execute(
    'UPDATE task SET title = ?, time = ?, completed = ?, updated_at = ? WHERE id = ?',
    [title, time, completed, new Date().toISOString(), id]
  );
  const rows = (await db.select('SELECT * FROM task WHERE id = ?', [id])) as Task[];
  return rows[0];
}

export async function deleteTask(id: string) {
  await db.execute('DELETE FROM task WHERE id = ?', [id]);
  return id;
}
