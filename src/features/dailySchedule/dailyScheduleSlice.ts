import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DailySchedule, Task, DailyScheduleState } from "@/types";
import {
  getUserSchedules as fetchSchedulesAPI,
  createOrUpdateDailySchedule as createScheduleAPI,
  updateSchedule as updateScheduleAPI,
  deleteDailySchedule as deleteScheduleAPI,
  addTaskToSchedule as addTaskToScheduleAPI,
  updateTaskInSchedule,
  deleteTaskFromSchedule,
} from "@/api/dailyScheduleApi"; // Hypothetical API functions

const initialState: DailyScheduleState = {
  schedules: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching schedules
export const fetchSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async () => {
    const response = await fetchSchedulesAPI();
    return response.data;
  }
);

// Async thunk for creating a new schedule
export const createSchedule = createAsyncThunk(
  "schedules/createSchedule",
  async (schedule: { date: string; tasks: Omit<Task, "_id">[] }) => {
    const response = await createScheduleAPI(schedule);
    await fetchSchedulesAPI();
    return response.data;
  }
);

export const addTaskToSchedule = createAsyncThunk(
  "schedules/addTaskToSchedule",
  async (schedule: { scheduleId: string; task: Omit<Task, "_id"> }) => {
    const response = await addTaskToScheduleAPI(
      schedule.scheduleId,
      schedule.task
    );
    await fetchSchedulesAPI();
    return response.data;
  }
);
// Async thunk for updating a schedule
export const editSchedule = createAsyncThunk(
  "schedules/editSchedule",
  async (schedule: DailySchedule) => {
    const response =
      schedule._id &&
      (await updateScheduleAPI(schedule._id, { tasks: schedule.tasks }));
    await fetchSchedulesAPI();
    return response.data;
  }
);

export const editTask = createAsyncThunk(
  "schedules/editTask",
  async (schedule: { _id: string; task: Task }) => {
    const response =
      schedule._id && (await updateTaskInSchedule(schedule._id, schedule.task));
    await fetchSchedulesAPI();
    return response.data;
  }
);

// Async thunk for deleting a schedule
export const removeSchedule = createAsyncThunk(
  "schedules/removeSchedule",
  async (scheduleId: string) => {
    await deleteScheduleAPI(scheduleId);
    return scheduleId;
  }
);

export const deleteTask = createAsyncThunk(
  "schedules/deleteTask",
  async (params: {scheduleId: string, taskId: string}) => {
    await deleteTaskFromSchedule(params.scheduleId, params.taskId);
    return params;
  }
);

const dailyScheduleSlice = createSlice({
  name: "dailySchedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchSchedules
      .addCase(fetchSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch schedules";
      })
      // Handle createSchedule
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })
      .addCase(addTaskToSchedule.fulfilled, (state, action) => {
        const schedule = state.schedules.find(
          (schedule) => schedule._id === action.payload.id
        );
        if (schedule) {
          schedule.tasks.push(action.payload.task);
        }
      })

      // Handle editSchedule
      .addCase(editSchedule.fulfilled, (state, action) => {
        if (!action.payload || !action.payload._id) {
          console.error("Payload mal formaté :", action.payload);
          return;
        }
        const index = state.schedules.findIndex(
          (schedule) => schedule._id === action.payload._id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })
      .addCase(editTask.fulfilled, (state, action) => {
        if (!action.payload || !action.payload.id) {
          console.error("Payload mal formaté :", action.payload);
          return;
        }

        // Trouver l'index du planning correspondant
        const index = state.schedules.findIndex(
          (schedule) => schedule._id === action.payload.id
        );

        if (index !== -1) {
          // Trouver l'index de la tâche à mettre à jour dans les tâches du planning
          const taskIndex = state.schedules[index].tasks.findIndex(
            (task) => task._id === action.payload.task._id
          );

          if (taskIndex !== -1) {
            // Mettre à jour la tâche avec les nouvelles données
            state.schedules[index].tasks[taskIndex] = {
              ...state.schedules[index].tasks[taskIndex],
              ...action.payload.task, // Mettre à jour les propriétés de la tâche
            };
          } else {
            console.error("Task not found in the schedule.");
          }
        } else {
          console.error("Schedule not found.");
        }
      })

      // Handle removeSchedule
      .addCase(removeSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (schedule) => schedule._id !== action.payload
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (schedule) => schedule._id === action.payload.scheduleId
        );

        if (index !== -1) {
          state.schedules[index].tasks.filter((task)=>task._id !== action.payload.taskId);
        }
      });
  },
});

export default dailyScheduleSlice.reducer;
