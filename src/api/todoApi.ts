import { TodoList, TodoItem } from "@/types";
import { fetchWrapper } from "@/utils/fetchWrapper";

// ➕ Créer une nouvelle todo
export const createTodo = async (
  todo: Omit<TodoList, "_id" | "createdAt" | "items" | "userId">
) => {
  return await fetchWrapper("/todos", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
};

// 🔎 Récupérer toutes les todos d'un utilisateur
export const getUserTodos = async () => {
  return await fetchWrapper("/todos/user", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// 🔎 Récupérer une todo spécifique par ID
export const getTodoById = async (todoId: string) => {
  return await fetchWrapper(`/todos/${todoId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

// ✏️ Mettre à jour une todo
export const updateTodo = async (
  todoId: string,
  updatedData: Partial<TodoList>
) => {
  return await fetchWrapper(`/todos/${todoId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
};

// ❌ Supprimer une todo
export const deleteTodo = async (todoId: string) => {
  return await fetchWrapper(`/todos/${todoId}`, {
    method: "DELETE",
    credentials: "include",
  });
};

// ➕ Ajouter un item dans une todo
export const addItemToTodo = async (
  todoId: string,
  item: Pick<TodoItem, "title">
) => {
  return await fetchWrapper(`/todos/${todoId}/items`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
};

// ✏️ Mettre à jour un item d'une todo
export const updateTodoItem = async (
  todoId: string,
  itemId: string,
  updatedData: Partial<TodoItem>
) => {
  return await fetchWrapper(`/todos/${todoId}/items/${itemId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
};

// ❌ Supprimer un item d'une todo
export const deleteTodoItem = async (todoId: string, itemId: string) => {
  return await fetchWrapper(`/todos/${todoId}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
