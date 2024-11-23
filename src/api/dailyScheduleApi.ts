import { fetchWrapper } from "@/utils/fetchWrapper";
import { DailySchedule, Task } from "@/types";

// Create or update a daily schedule
export const createOrUpdateDailySchedule = async (schedule: {
  date: string;
  tasks: Omit<Task, "_id">[];
}) => {
  return await fetchWrapper("/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(schedule),
  });
};

// Get a user's daily schedule by date
export const getUserSchedules = async () => {
  return await fetchWrapper(`/schedules/user`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// Get a user's daily schedule by date
export const getDailyScheduleByDate = async (date: string) => {
  return await fetchWrapper(`/schedules/user/date/${date}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// Update a specific task within a daily schedule
export const updateSchedule = async (
  scheduleId: string,
  updatedFields: Partial<DailySchedule>
) => {
  return await fetchWrapper(`/schedules/${scheduleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updatedFields),
  });
};

export const addTaskToSchedule = async (
  scheduleId: string,
  task: Omit<Task, "_id">
) => {
  return await fetchWrapper(`/schedules/${scheduleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ task }),
  });
};

// Update a specific task within a daily schedule
export const updateTaskInSchedule = async (
  scheduleId: string,
  task: Partial<Task>
) => {
  return await fetchWrapper(`/schedules/${scheduleId}/${task._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({task}),
  });
};

// Delete a specific task from a daily schedule
export const deleteTaskFromSchedule = async (
  scheduleId: string,
  taskId: string
) => {
  return await fetchWrapper(`/schedules/${scheduleId}/tasks/${taskId}`, {
    credentials: "include",
    method: "DELETE",
  });
};

// Delete a daily schedule
export const deleteDailySchedule = async (scheduleId: string) => {
  return await fetchWrapper(`/schedules/${scheduleId}`, {
    credentials: "include",
    method: "DELETE",
  });
};
