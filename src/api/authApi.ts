import { UserInterface } from "@/types";
import { fetchWrapper } from "@/utils/fetchWrapper";

// Fonction de connexion
export const login = async (email: string, password: string) => {
  return await fetchWrapper("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
};

// Fonction d'inscription
export const register = async (
  email: string,
  password: string,
  name: string
) => {
  return await fetchWrapper("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });
};

// Fonction de déconnexion
export const logout = async () => {
  await fetchWrapper("/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const updateProfile = async (updatedData: Partial<UserInterface>) => {
  return await fetchWrapper(`/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updatedData),
  });
};
export const deleteAccount = async () => {
  return await fetchWrapper(`/account`, {
    method: "DELETE",
    credentials: "include",
  });
};
export const passwordForgotten = async (email: string) => {
  return await fetchWrapper(`/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({email})
  });
};