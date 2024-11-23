// src/services/goalsService.ts
import { AppDispatch } from "@/app/store";
import {
  updateProfile,
  deleteAccount,
} from "@/features/user/userSlice";
import {
  updateProfile as updateProfileApi,
  deleteAccount as deleteAccountApi,
} from "@/api/userApi";
import { UserInterface } from "@/types";

export const updateUserProfile =
  (updatedData: Partial<UserInterface>) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await updateProfileApi(updatedData);
      dispatch(updateProfile(data));
    } catch (error) {
      console.error("Error updating user's profile:", error);
    }
  };

// Supprimer un objectif
export const deleteGoal = () => async (dispatch: AppDispatch) => {
  try {
    await deleteAccountApi();
    dispatch(deleteAccount());
  } catch (error) {
    console.error("Error deleting goal:", error);
  }
};
