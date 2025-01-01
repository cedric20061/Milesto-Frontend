import { useState, useEffect } from "react";
import {
  fetchSchedules,
  editSchedule,
  deleteTask,
} from "@/features/dailySchedule/dailyScheduleSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  saveTasksToDB,
  getTasksFromDB,
  clearDB,
} from "@/utils/indexedDBDailyTaskDB";
import { format, addDays, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/app/Modal";
import TaskUpdateModal from "@/components/app/TaskModal";
import { Milestone, Task, TaskItemProps } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchGoals } from "@/features/goals/goalsSlice";
import VerificationDisplayer from "@/components/app/VerificationDisplayer";
import { getScheduleForDate } from "@/utils/function";
import ScheduleCard from "@/components/app/ScheduleCard";
import AddOrdEditTask from "@/components/app/AddOrdEditTask";

const TaskItem: React.FC<TaskItemProps> = ({ task, completed, onToggle }) => (
  <div className="flex items-center justify-between space-x-2 py-2">
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`task-${task._id}`}
        checked={completed}
        onCheckedChange={onToggle}
      />
      <label
        htmlFor={`task-${task._id}`}
        className={`text-sm ${
          completed
            ? "line-through text-[#A8DCE7] dark:text-[#272B3B]"
            : "text-[#272B3B] dark:text-[#A8DCE7]"
        }`}
      >
        {task.title}
      </label>
    </div>
  </div>
);
export default function PlanningDayPage() {
  const dispatch = useAppDispatch();
  const { schedules } = useAppSelector(
    (state) => state.dailySchedule
  );
  const { goals, status } = useAppSelector((state) => state.goals);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [recurringTasks, setRecurringTasks] = useState<Milestone[]>([]);
  const [onDeleting, setOnDeleting] = useState<boolean>(false);
  const [commingSoon, setCommingSoon] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Fetch goals on initial load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGoals());
    }
  }, [dispatch, status]);
  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);
  useEffect(() => {
    const loadTasks = async () => {
      // Récupérer les tâches existantes depuis la base de données locale
      const tasksFromDB = await getTasksFromDB();

      // Extraire toutes les milestones avec everyDayAction des goals actuels
      const dailyMilestones = goals.flatMap((goal) =>
        goal.milestones.filter(
          (milestone: Milestone) => milestone.everyDayAction
        )
      );

      // Vérifier si des tâches dans la base de données locale sont toujours valides
      const validTasks = tasksFromDB.filter((task: Milestone) =>
        dailyMilestones.some(
          (milestone) =>
            milestone._id == task._id &&
            milestone.title === task.title &&
            milestone.description === task.description &&
            new Date(milestone.targetDate).toISOString() ===
              new Date(task.targetDate).toISOString()
        )
      );

      // Identifier les nouvelles tâches `everyDayAction` non présentes dans la base de données locale
      const newTasks = dailyMilestones.filter(
        (milestone) =>
          !tasksFromDB.some(
            (task) =>
              milestone.title === task.title &&
              milestone.description === task.description &&
              new Date(milestone.targetDate).toISOString() ===
                new Date(task.targetDate).toISOString()
          )
      );

      // Mettre à jour les tâches récurrentes avec les tâches valides et les nouvelles
      const updatedRecurringTasks = [...validTasks, ...newTasks];
      setRecurringTasks(updatedRecurringTasks);

      // Sauvegarder les tâches mises à jour dans la base de données locale
      if (newTasks.length > 0 || validTasks.length !== tasksFromDB.length) {
        await saveTasksToDB(updatedRecurringTasks);
      }
    };

    loadTasks();
  }, [goals]);

  useEffect(() => {
    const resetTasksAtMidnight = () => {
      const now = new Date();
      const timeUntilMidnight =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        ).getTime() - now.getTime();

      setTimeout(async () => {
        await clearDB();
        const dailyMilestones = goals.flatMap((goal) =>
          goal.milestones.filter(
            (milestone: Milestone) => milestone.everyDayAction
          )
        );

        setRecurringTasks(dailyMilestones);
      }, timeUntilMidnight);
    };

    resetTasksAtMidnight();
  }, [goals]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleRecurringTask = async (id: string) => {
    setRecurringTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasksToDB(updatedTasks);
      return updatedTasks;
    });
  };

  const handleDeleteTask = async (scheduleId: string, taskId: string) => {
    await dispatch(deleteTask({ scheduleId, taskId }));
    await dispatch(fetchSchedules());
  };
  const handleStatusChange = (taskId: string, newStatus: "complet") => {
    const scheduleForSelectedDate = getScheduleForDate(format(selectedDate, "yyyy-MM-dd"), schedules);
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
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#101422] dark:text-[#A8DCE7]">
            Day Planning
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              variant="outline"
              className="bg-[#A8DCE7] text-[#272B3B] hover:bg-[#272B3B] hover:text-[#A8DCE7] dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B] rounded-full"
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
              className="bg-[#A8DCE7] text-[#272B3B] hover:bg-[#272B3B] hover:text-[#A8DCE7] dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B] rounded-full"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        {
          <ScheduleCard
            type="yesterday"
            schedule={previousDaySchedule}
            setCurrentTask={setCurrentTask}
            setShowTaskUpdateModal={setShowTaskUpdateModal}
            setShowTaskModal={setShowTaskModal}
            setTaskToDelete={setTaskToDelete}
            setOnDeleting={setOnDeleting}
          />
        }

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
          className="w-full bg-[#272B3B] text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-[#272B3B] dark:bg-[#A8DCE7] dark:text-[#272B3B] dark:hover:bg-[#272B3B] dark:hover:text-[#A8DCE7] rounded-full"
        >
          Use AI Planner
        </Button>

        {recurringTasks.length > 0 && (
          <Card className="bg-indigo-50 dark:bg-[#272B3B]">
            <CardHeader>
              <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
                Daily Recurring Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="pr-4">
                {recurringTasks.map((task: Milestone) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    completed={task.completed}
                    onToggle={() => task._id && toggleRecurringTask(task._id)}
                  />
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
        <Card className="bg-indigo-50 dark:bg-[#272B3B]">
          <CardHeader>
            <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
              Pomodoro Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold mb-4 text-[#272B3B] dark:text-[#A8DCE7]">
                {formatTime(pomodoroTime)}
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-[#272B3B] text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-[#272B3B] dark:bg-[#A8DCE7] dark:text-[#272B3B] dark:hover:bg-[#272B3B] dark:hover:text-[#A8DCE7]"
                >
                  {isRunning ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={() => {
                    setPomodoroTime(25 * 60);
                    setIsRunning(false);
                  }}
                  className="bg-[#A8DCE7] text-[#272B3B] hover:bg-[#272B3B] hover:text-[#A8DCE7] dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B]"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
              className="bg-[#FFFFFF] dark:bg-[#272B3B] rounded-lg p-6 max-w-2xl w-full mx-auto shadow-xl"
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
                <p className="text-[#101422] dark:text-[#A8DCE7] text-lg font-semibold mb-4">
                  Are you sure you want to delete this task?
                </p>
                <p className="text-[#101422] dark:text-[#A8DCE7] mb-6">
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
            className="bg-[#FFFFFF] dark:bg-[#272B3B] rounded-lg p
          -6 max-w-2xl w-full mx-auto"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-[#101422] dark:text-[#FFFFFF] text-2xl font-bold mb-4">
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
