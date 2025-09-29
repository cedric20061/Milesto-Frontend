import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Goals, Milestone } from "@/types/index";
import {
  getUserGoals as fetchGoalsAPI,
  createGoal as createGoalAPI,
  updateGoal as updateGoalAPI,
  deleteGoal as deleteGoalAPI,
} from "@/api/goalsApi"; // Hypothetical API functions

interface GoalsState {
  goals: Goals[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching goals
export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const response = await fetchGoalsAPI();
  return response.data;
});

// Async thunk for creating a new goal
export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goal: Goals) => {
    const response = await createGoalAPI(goal);
    await fetchGoalsAPI();
    return response.data;
  }
);

// Async thunk for updating a goal
export const editGoal = createAsyncThunk(
  "goals/editGoal",
  async (goal: Goals) => {
    const response = goal._id && await updateGoalAPI(goal._id, goal);
    await fetchGoalsAPI();
    return response.data;
  }
);

// Async thunk for deleting a goal
export const removeGoal = createAsyncThunk(
  "goals/removeGoal",
  async (goalId: string) => {
    await deleteGoalAPI(goalId);
    await fetchGoalsAPI();
    return goalId;
  }
);

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    // Milestone operations
    addMilestoneToGoal: (
      state,
      action: PayloadAction<{ goalId: string; milestone: Milestone }>
    ) => {
      const goal = state.goals.find(
        (goal) => goal._id === action.payload.goalId
      );
      if (goal) {
        goal.milestones = goal.milestones
          ? [...goal.milestones, action.payload.milestone]
          : [action.payload.milestone];
      }
    },
    updateMilestone: (
      state,
      action: PayloadAction<{ goalId: string; milestone: Milestone }>
    ) => {
      const goal = state.goals.find(
        (goal) => goal._id === action.payload.goalId
      );
      if (goal && goal.milestones) {
        const milestoneIndex = goal.milestones.findIndex(
          (milestone) => milestone._id === action.payload.milestone._id
        );
        if (milestoneIndex !== -1) {
          goal.milestones[milestoneIndex] = action.payload.milestone;
        }
      }
    },
    deleteMilestone: (
      state,
      action: PayloadAction<{ goalId: string; milestoneId: string }>
    ) => {
      const goal = state.goals.find(
        (goal) => goal._id === action.payload.goalId
      );
      if (goal && goal.milestones) {
        goal.milestones = goal.milestones.filter(
          (milestone) => milestone._id !== action.payload.milestoneId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchGoals
      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch goals";
      })
      // Handle createGoal
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      // Handle editGoal
      .addCase(editGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(
          (goal) => goal._id === action.payload._id
        );
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      // Handle removeGoal
      .addCase(removeGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal._id !== action.payload);
      });
  },
});

export const { addMilestoneToGoal, updateMilestone, deleteMilestone } =
  goalsSlice.actions;

export default goalsSlice.reducer;
