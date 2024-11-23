import { Milestone } from '@/types';
import { openDB } from 'idb';

const DB_NAME = 'DailyTasksDB';
const STORE_NAME = 'RecurringTasks';

export const initializeDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: '_id' });
      }
    },
  });
};

export const saveTaskToDB = async (task: Milestone[]) => {
  const db = await initializeDB();
  await db.put(STORE_NAME, task);
};
export const saveTasksToDB = async (tasks: Milestone[]) => {
    const db = await initializeDB();
  
    for (const task of tasks) {
      if (!task._id) {
        console.error('Task is missing an "id" property:', task);
        continue;
      }
  
      await db.put(STORE_NAME, task);
    }
  };
  
export const getTasksFromDB = async () => {
  const db = await initializeDB();
  return await db.getAll(STORE_NAME);
};

export const clearDB = async () => {
  const db = await initializeDB();
  await db.clear(STORE_NAME);
};
