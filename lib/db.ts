import Database from '@tauri-apps/plugin-sql';

const db = await Database.load('sqlite:main.db');
