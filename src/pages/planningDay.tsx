"use client";

import { useState, useEffect } from "react";
import {
  fetchSchedules,
  editSchedule,
  deleteTask,
} from "@/features/dailySchedule/dailyScheduleSlice";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  saveTasksToDB,
  getTasksFromDB,
  clearDB,
} from "@/utils/indexedDBDailyTaskDB";
import { format, addDays, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/app/Modal";
import TaskUpdateModal from "@/components/app/TaskModal";
import type { Task } from "@/types";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchGoals } from "@/features/goals/goalsSlice";
import VerificationDisplayer from "@/components/app/VerificationDisplayer";
import { getScheduleForDate } from "@/utils/function";
import ScheduleCard from "@/components/app/ScheduleCard";
import AddOrdEditTask from "@/components/app/AddOrdEditTask";
import TodoListManager from "@/components/app/ToDoList";
import PomodoroTimer from "@/components/app/PomodoroTimer";
import DailyRecurringTasks from "@/components/app/DailyRecuringTask";

export default function PlanningDayPage() {
  const dispatch = useAppDispatch();
  const { schedules } = useAppSelector((state) => state.dailySchedule);
  const { goals, status } = useAppSelector((state) => state.goals);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
  const [onDeleting, setOnDeleting] = useState<boolean>(false);
  const [commingSoon, setCommingSoon] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeSection, setActiveSection] = useState<
    "planning" | "todos" | "focus"
  >("planning");

  // Fetch goals on initial load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGoals());
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleDeleteTask = async (scheduleId: string, taskId: string) => {
    await dispatch(deleteTask({ scheduleId, taskId }));
    await dispatch(fetchSchedules());
  };

  const handleStatusChange = (taskId: string, newStatus: "complet") => {
    const scheduleForSelectedDate = getScheduleForDate(
      format(selectedDate, "yyyy-MM-dd"),
      schedules
    );
    if (scheduleForSelectedDate) {
      const updatedTasks = scheduleForSelectedDate.tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      const updatedSchedule = {
        ...scheduleForSelectedDate,
        tasks: updatedTasks,
      };
      dispatch(editSchedule(updatedSchedule));
      dispatch(fetchSchedules());
    }
  };

  const previousDaySchedule = getScheduleForDate(
    format(subDays(selectedDate, 1), "yyyy-MM-dd"),
    schedules
  );

  const schedule = getScheduleForDate(
    format(selectedDate, "yyyy-MM-dd"),
    schedules
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            Day Planning
          </h1>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeSection === "planning" ? "default" : "outline"}
              onClick={() => setActiveSection("planning")}
            >
              Planification
            </Button>
            <Button
              variant={activeSection === "todos" ? "default" : "outline"}
              onClick={() => setActiveSection("todos")}
            >
              Todo-Listes
            </Button>
            <Button
              variant={activeSection === "focus" ? "default" : "outline"}
              onClick={() => setActiveSection("focus")}
            >
              Focus
            </Button>
          </div>
        </div>

        {activeSection === "planning" && (
          <>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                variant="outline"
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="font-semibold">
                {format(selectedDate, "dd/MM/yyyy")}
              </span>
              <Button
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                variant="outline"
                className="rounded-full"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <ScheduleCard
              type="yesterday"
              schedule={previousDaySchedule}
              setCurrentTask={setCurrentTask}
              setShowTaskUpdateModal={setShowTaskUpdateModal}
              setShowTaskModal={setShowTaskModal}
              setTaskToDelete={setTaskToDelete}
              setOnDeleting={setOnDeleting}
            />

            <ScheduleCard
              type="today"
              schedule={schedule}
              setCurrentTask={setCurrentTask}
              setShowTaskUpdateModal={setShowTaskUpdateModal}
              setShowTaskModal={setShowTaskModal}
              setTaskToDelete={setTaskToDelete}
              setOnDeleting={setOnDeleting}
            />

            <Button
              onClick={() => setCommingSoon(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            >
              Use AI Planner
            </Button>

            <DailyRecurringTasks
              goals={goals}
              saveTasksToDB={saveTasksToDB}
              getTasksFromDB={getTasksFromDB}
              clearDB={clearDB}
            />
          </>
        )}

        {activeSection === "todos" && <TodoListManager />}

        {activeSection === "focus" && (
          <div className="space-y-6">
            <PomodoroTimer />
            <DailyRecurringTasks
              goals={goals}
              saveTasksToDB={saveTasksToDB}
              getTasksFromDB={getTasksFromDB}
              clearDB={clearDB}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showTaskModal && (
          <AddOrdEditTask
            currentTask={currentTask}
            selectedDate={selectedDate}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            setCurrentTask={setCurrentTask}
          />
        )}
        {onDeleting && taskToDelete && (
          <Modal isOpen={onDeleting} onClose={() => setOnDeleting(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-lg p-6 max-w-2xl w-full mx-auto shadow-xl"
            >
              <VerificationDisplayer
                validFonction={() => {
                  if (schedule?._id) {
                    handleDeleteTask(schedule._id, taskToDelete._id);
                  }
                  setOnDeleting(false);
                }}
                onClose={() => setOnDeleting(false)}
              >
                <p className="text-foreground text-lg font-semibold mb-4">
                  Are you sure you want to delete this task?
                </p>
                <p className="text-foreground mb-6">
                  This action cannot be undone.
                </p>
              </VerificationDisplayer>
            </motion.div>
          </Modal>
        )}
        <Modal isOpen={commingSoon} onClose={() => setCommingSoon(false)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-background rounded-lg p-6 max-w-2xl w-full mx-auto"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-foreground text-2xl font-bold mb-4">
                Comming soon!!!!!!
              </p>
            </div>
          </motion.div>
        </Modal>
        {showTaskUpdateModal && currentTask && (
          <TaskUpdateModal
            task={currentTask}
            isOpen={showTaskUpdateModal}
            onClose={() => {
              setCurrentTask(null);
              setShowTaskUpdateModal(false);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </>
  );
}
