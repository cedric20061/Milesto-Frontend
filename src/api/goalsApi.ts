import { Goals, Milestone } from "@/types/index";
import { fetchWrapper } from "@/utils/fetchWrapper";

// Créer un nouvel objectif
export const createGoal = async (goal: Omit<Goals, "id">) => {
  return await fetchWrapper("/goals", {
    method: "POST",
    credentials:"include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
};

// Récupérer tous les objectifs d'un utilisateur
export const getUserGoals = async () => {
  return await fetchWrapper(`/goals/user`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// Récupérer un objectif spécifique par ID
export const getGoalById = async (goalId: string) => {
  return await fetchWrapper(`/goals/${goalId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// Mettre à jour un objectif
export const updateGoal = async (
  goalId: string,
  updatedData: Partial<Goals>
) => {
  return await fetchWrapper(`/goals/${goalId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
};

// Supprimer un objectif
export const deleteGoal = async (goalId: string) => {
  return await fetchWrapper(`/goals/${goalId}`, {
    method: "DELETE",
    credentials: "include",
  });
};

// Créer un nouveau jalon pour un objectif spécifique
export const addMilestoneToGoal = async (goalId: string, milestone: Omit<Milestone, "id">) => {
  return await fetchWrapper(`/goals/${goalId}/milestones`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestone),
  });
};

// Récupérer tous les jalons d'un objectif
export const getMilestones = async (goalId: string) => {
  return await fetchWrapper(`/goals/${goalId}/milestones`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// Mettre à jour un jalon spécifique
export const updateMilestone = async (
  goalId: string,
  milestoneId: string,
  updatedData: Partial<Milestone>
) => {
  return await fetchWrapper(`/goals/${goalId}/milestones/${milestoneId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
};

// Supprimer un jalon spécifique
export const deleteMilestone = async (goalId: string, milestoneId: number) => {
  return await fetchWrapper(`/goals/${goalId}/milestones/${milestoneId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
