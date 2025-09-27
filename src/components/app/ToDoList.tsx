"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  ListTodo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchTodos,
  createTodo,
  editTodo,
  removeTodo,
  addItem,
  editItem,
  removeItem,
  toggleItemCompleted,
} from "@/features/todo/todoSlice";

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#EC4899", // Pink
];

export default function TodoListManager() {
  const dispatch = useAppDispatch();
  const {
    todos: todoLists,
    status,
    error,
  } = useAppSelector((state) => state.todos);

  const [isCreating, setIsCreating] = useState(false);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [activeList, setActiveList] = useState<string | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const createTodoList = async () => {
    if (!newListName.trim()) return;

    const safeLength = Array.isArray(todoLists) ? todoLists.length : 0;
    const newList = {
      name: newListName,
      description: newListDescription,
      color: COLORS[safeLength % COLORS.length],
    };

    await dispatch(createTodo(newList));
    setNewListName("");
    setNewListDescription("");
    setIsCreating(false);
  };

  const deleteTodoList = async (listId: string) => {
    await dispatch(removeTodo(listId));
    if (activeList === listId) {
      setActiveList(null);
    }
  };

  const updateListName = async (listId: string, newName: string) => {
    await dispatch(editTodo({ _id: listId, name: newName }));
    setEditingList(null);
  };

  const addTodoItem = async (listId: string) => {
    if (!newItemTitle.trim()) return;

    await dispatch(addItem({ todoId: listId, title: newItemTitle }));
    setNewItemTitle("");
  };

  const toggleTodoItem = async (listId: string, itemId: string) => {
    dispatch(toggleItemCompleted({ todoId: listId, itemId }));

    const todo = Array.isArray(todoLists)
      ? todoLists.find((t) => t._id === listId)
      : null;
    const item = todo?.items?.find((i) => i._id === itemId);

    if (item) {
      await dispatch(
        editItem({
          todoId: listId,
          item: { _id: itemId, completed: !item.completed },
        })
      );
    }
  };

  const deleteTodoItem = async (listId: string, itemId: string) => {
    await dispatch(removeItem({ todoId: listId, itemId }));
  };

  const activeListData = Array.isArray(todoLists)
    ? todoLists.find((list) => list._id === activeList)
    : null;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading lists...</span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => dispatch(fetchTodos())} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!Array.isArray(todoLists) || todoLists.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">My Todo Lists</h2>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        </div>

        {/* Empty state */}
        <motion.div
          className="flex flex-col items-center justify-center h-64 text-center space-y-6 bg-indigo-50 dark:bg-[#272B3B] rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ListTodo className="w-16 h-16 text-[#A8DCE7] dark:text-indigo-50" />
          </motion.div>
          <motion.h2
            className="text-2xl font-semibold text-[#272B3B] dark:text-[#A8DCE7]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            No lists yet
          </motion.h2>
          <motion.p
            className="text-[#101422] dark:text-[#A8DCE7]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Organize your tasks by creating your first todo list. Stay in
            control of your projects and achieve your goals more easily.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              className="flex items-center space-x-2 bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B] px-6 py-3 rounded-full transition-all duration-300"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create my first list
            </Button>
          </motion.div>
        </motion.div>

        {/* Create new list modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-[#101422]/70 dark:bg-[#000000]/70 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <Card className="bg-[#FFFFFF] dark:bg-[#272B3B] border border-[#A8DCE7]/20 shadow-lg w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle>Create a new list</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="List name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={createTodoList} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setNewListName("");
                        setNewListDescription("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Todo Lists</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>

      {/* Create new list modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#101422]/70 dark:bg-[#000000]/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Card className="bg-[#FFFFFF] dark:bg-[#272B3B] border border-[#A8DCE7]/20 shadow-lg w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Create a new list</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={createTodoList} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewListName("");
                      setNewListDescription("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todoLists.map((list) => (
          <Card
            key={list._id}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-indigo-50 dark:bg-[#272B3B]"
            style={{ borderLeft: `4px solid ${list.color}` }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {editingList === list._id ? (
                  <Input
                    value={list.name}
                    onChange={(e) => updateListName(list._id, e.target.value)}
                    onBlur={() => setEditingList(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingList(null);
                      }
                    }}
                    className="text-sm"
                    autoFocus
                  />
                ) : (
                  <CardTitle
                    className="text-lg cursor-pointer"
                    onClick={() => setActiveList(list._id)}
                  >
                    {list.name}
                  </CardTitle>
                )}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingList(list._id)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTodoList(list._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {list.description && (
                <p className="text-sm text-muted-foreground">
                  {list.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {Array.isArray(list.items) ? list.items.length : 0} tasks
                  </span>
                  <span>
                    {Array.isArray(list.items)
                      ? list.items.filter((item) => item.completed).length
                      : 0}{" "}
                    completed
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        Array.isArray(list.items) && list.items.length > 0
                          ? (list.items.filter((item) => item.completed)
                              .length /
                              list.items.length) *
                            100
                          : 0
                      }%`,
                      backgroundColor: list.color,
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-transparent"
                  onClick={() => setActiveList(list._id)}
                >
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active list detail modal */}
      <AnimatePresence>
        {activeList && activeListData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#101422]/70 dark:bg-[#000000]/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Card className="bg-[#FFFFFF] dark:bg-[#272B3B] border border-[#A8DCE7]/20 shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: activeListData.color }}>
                    {activeListData.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveList(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {activeListData.description && (
                  <p className="text-muted-foreground">
                    {activeListData.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="space-y-4 h-full">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New task..."
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addTodoItem(activeList);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={() => addTodoItem(activeList)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="space-y-2 pr-4">
                      {Array.isArray(activeListData.items) &&
                      activeListData.items.length > 0 ? (
                        activeListData.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between p-2 rounded-lg border"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={() =>
                                  toggleTodoItem(activeList, item._id)
                                }
                              />
                              <span
                                className={`${
                                  item.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {item.title}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                deleteTodoItem(activeList, item._id)
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No tasks in this list</p>
                          <p className="text-sm">Add your first task above</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
