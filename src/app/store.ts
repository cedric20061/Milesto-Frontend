// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice.ts';
import goalsReducer from '@/features/goals/goalsSlice';
import todoReducer from '@/features/todo/todoSlice';
import dailyScheduleReducer from '@/features/dailySchedule/dailyScheduleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalsReducer,
    dailySchedule: dailyScheduleReducer,
    todos: todoReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
