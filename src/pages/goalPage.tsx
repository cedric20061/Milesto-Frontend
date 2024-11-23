"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Goals as Goal } from "@/types/index";
import GoalCard from "@/components/app/GoalCard";
import GoalForm from "@/components/app/GoalForm";
import { Plus, Filter, X, ChevronUp, ChevronDown } from "lucide-react";
import Modal from "@/components/app/Modal";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { DateRange } from "react-day-picker";

export default function GoalsPage() {
  const dispatch = useAppDispatch();
  const { goals, status } = useAppSelector((state) => state.goals);
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGoals());
    }
  }, [dispatch, status]);

  const filteredGoals = goals.filter((goal) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && goal.status !== "complet") ||
      (statusFilter === "completed" && goal.status === "complet");

    const matchesCategory =
      categoryFilter === "all" || goal.category === categoryFilter;

    const matchesDateRange =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(goal.targetDate) >= (dateRange.from as Date) &&
        new Date(goal.targetDate) <= (dateRange.to as Date));

    const matchesPriority =
      priorityFilter === "all" || goal.priority === priorityFilter;

    return (
      matchesStatus && matchesCategory && matchesDateRange && matchesPriority
    );
  });

  const categories = goals.reduce((acc, goal) => {
    const existing = acc.find((item) => item === goal.category)
    if (!existing) {
      acc.push(goal.category)

    } 
    return acc
  }, [] as string[]);

  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setPriorityFilter("all");
  };

  return (
    <>
        <motion.h1
          className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#101422] dark:text-[#A8DCE7]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Goals
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 bg-indigo-50 dark:bg-[#272B3B]">
            <CardHeader>
              <CardTitle className="text-[#101422] dark:text-[#A8DCE7] flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full space-y-4 sm:space-y-0">
                  <span className="text-lg font-semibold text-[#101422] dark:text-[#A8DCE7]">Goal List</span>
                  <div className="flex w-full sm:w-auto sm:ml-auto justify-between sm:justify-start space-x-0 sm:space-x-4">
                    <Button
                      onClick={() => setShowFilters((prev) => !prev)}
                      variant="outline"
                      size="sm"
                      className="bg-indigo-50 text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7] dark:hover:bg-[#FFFFFF] dark:hover:text-[#101422] rounded-full"
                    >
                      {showFilters ? (
                        <ChevronUp className="mr-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="mr-2 h-4 w-4" />
                      )}
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    <Button
                      onClick={() => setIsAdding(true)}
                      className="bg-[#272B3B] text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-[#272B3B] dark:bg-[#A8DCE7] dark:text-[#272B3B] dark:hover:bg-[#272B3B] dark:hover:text-[#A8DCE7] rounded-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Goal
                    </Button>
                  </div>
                </div>
              </CardTitle>
              {showFilters && (
                <div className="flex flex-wrap justify-between items-center mt-4">
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[140px] bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[140px] bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="w-[140px] bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="basse">Low</SelectItem>
                        <SelectItem value="moyenne">Medium</SelectItem>
                        <SelectItem value="haute">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <DatePickerWithRange
                      dateRange={dateRange}
                      setDateRange={(range: DateRange | undefined)=> typeof(range) != "undefined" && setDateRange(range)}
                      className="w-[240px] bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7]"
                    />
                  </div>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="mt-2 sm:mt-0 bg-indigo-50 text-[#101422] hover:bg-[#272B3B] hover:text-[#FFFFFF] dark:bg-[#101422] dark:text-[#A8DCE7] dark:hover:bg-[#FFFFFF] dark:hover:text-[#101422] rounded-full"
                  >
                    <X className="mr-2 h-4 w-4" /> Clear Filters
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <AnimatePresence>
                {filteredGoals.length > 0 ? (
                  filteredGoals.map((goal: Goal) => (
                    <motion.div
                      key={goal._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GoalCard goal={goal} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center py-16 text-center text-[#101422] dark:text-[#A8DCE7]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <motion.div
                      className="mb-4 text-xl font-semibold"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    >
                      No goals found matching your filters.
                    </motion.div>
                    <motion.p
                      className="mb-6 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    >
                      Try adjusting your filters or add a new goal.
                    </motion.p>
                    <Button
                      onClick={clearFilters}
                      className="bg-[#101422] text-[#FFFFFF] hover:bg-[#272B3B] dark:bg-[#A8DCE7] dark:text-[#101422] dark:hover:bg-[#FFFFFF]"
                    >
                      <Filter className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {(isAdding || editingGoal) && (
            <Modal
              isOpen={isAdding || !!editingGoal}
              onClose={() => {
                setIsAdding(false);
                setEditingGoal(null);
              }}
            >
              <Card className="mb-8 bg-[#FFFFFF] dark:bg-[#272B3B]">
                <CardHeader>
                  <CardTitle className="text-[#101422] dark:text-[#A8DCE7] font-semibold text-lg text-center">
                    {isAdding ? "Add New Goal" : "Edit Goal"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoalForm
                    goal={editingGoal}
                    onClose={() => {
                      setIsAdding(false);
                      setEditingGoal(null);
                    }}
                  />
                </CardContent>
              </Card>
            </Modal>
          )}
        </AnimatePresence>
      </>
  );
}
