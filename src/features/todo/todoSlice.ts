import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TodoList, TodoItem } from "@/types"; // 👉 À créer selon tes interfaces côté front
import {
  getUserTodos as fetchTodosAPI,
  createTodo as createTodoAPI,
  updateTodo as updateTodoAPI,
  deleteTodo as deleteTodoAPI,
  addItemToTodo as addItemAPI,
  updateTodoItem as updateItemAPI,
  deleteTodoItem as deleteItemAPI,
} from "@/api/todoApi"; // 👉 Fonctions d'appel API à créer

interface TodosState {
  todos: TodoList[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  status: "idle",
  error: null,
};

/* ──────────────────────────────
   ✅ Async Thunks
────────────────────────────────*/

// Récupérer toutes les todos d’un utilisateur
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await fetchTodosAPI();
  return response;
});

// Créer une nouvelle todo
export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todo: Omit<TodoList, "_id" | "createdAt" | "items" | "userId">) => {
    const response = await createTodoAPI(todo);
    return response;
  }
);

// Mettre à jour une todo
export const editTodo = createAsyncThunk(
  "todos/editTodo",
  async (todo: Partial<TodoList> & { _id: string }) => {
    const response = await updateTodoAPI(todo._id, todo);
    return response;
  }
);

// Supprimer une todo
export const removeTodo = createAsyncThunk(
  "todos/removeTodo",
  async (todoId: string) => {
    await deleteTodoAPI(todoId);
    return todoId;
  }
);

// Ajouter un item à une todo
export const addItem = createAsyncThunk(
  "todos/addItem",
  async ({ todoId, title }: { todoId: string; title: string }) => {
    const response = await addItemAPI(todoId, { title });
    return { todoId, items: response.items as TodoItem[] };
  }
);

// Mettre à jour un item d’une todo
export const editItem = createAsyncThunk(
  "todos/editItem",
  async ({
    todoId,
    item,
  }: {
    todoId: string;
    item: Partial<TodoItem> & { _id: string };
  }) => {
    const response = await updateItemAPI(todoId, item._id, item);
    return { todoId, items: response.items as TodoItem[] };
  }
);

// Supprimer un item d’une todo
export const removeItem = createAsyncThunk(
  "todos/removeItem",
  async ({ todoId, itemId }: { todoId: string; itemId: string }) => {
    const response = await deleteItemAPI(todoId, itemId);
    return { todoId, items: response.items as TodoItem[] };
  }
);

/* ──────────────────────────────
   ✅ Slice
────────────────────────────────*/
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Mise à jour optimiste côté client (optionnel)
    toggleItemCompleted: (
      state,
      action: PayloadAction<{ todoId: string; itemId: string }>
    ) => {
      const todo = state.todos.find((t) => t._id === action.payload.todoId);
      if (todo) {
        const item = todo.items.find((i) => i._id === action.payload.itemId);
        if (item) item.completed = !item.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch todos */
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch todos";
      })
      /* Create todo */
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      /* Update todo */
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.todos[index] = action.payload;
      })
      /* Delete todo */
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t._id !== action.payload);
      })
      /* Add item */
      .addCase(addItem.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t._id === action.payload.todoId);
        if (todo) todo.items = action.payload.items;
      })
      /* Edit item */
      .addCase(editItem.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t._id === action.payload.todoId);
        if (todo) todo.items = action.payload.items;
      })
      /* Delete item */
      .addCase(removeItem.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t._id === action.payload.todoId);
        if (todo) todo.items = action.payload.items;
      });
  },
});

export const { toggleItemCompleted } = todoSlice.actions;
export default todoSlice.reducer;
