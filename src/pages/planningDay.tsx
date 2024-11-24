import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchSchedules,
  createSchedule,
  editSchedule,
  addTaskToSchedule,
  editTask,
  deleteTask,
} from "@/features/dailySchedule/dailyScheduleSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CircleDot,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  saveTasksToDB,
  getTasksFromDB,
  clearDB,
} from "@/utils/indexedDBDailyTaskDB";
import { format, addDays, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/app/Modal";
import TaskUpdateModal from "@/components/app/TaskModal";
import { Milestone, Task, TaskItemProps, TaskWithOptionalId } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/app/hooks";
import { fetchGoals } from "@/features/goals/goalsSlice";
import VerificationDisplayer from "@/components/app/VerificationDisplayer";
import { getScheduleForDate } from "@/utils/function";

const NoScheduleMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="text-center p-4 bg-[#A8DCE7] dark:bg-[#272B3B] rounded-full text-[#272B3B] dark:text-[#A8DCE7]"
  >
    <p>{message}</p>
  </motion.div>
);

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
  const dispatch = useDispatch<AppDispatch>();
  const { schedules } = useAppSelector(
    (state: RootState) => state.dailySchedule
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
  const [isCompleting, setIsCompleting] = useState(false);

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

  const handleAddOrEditTask = (task: Omit<Task, "_id">) => {
    const scheduleForSelectedDate = schedules.find((schedule) => {
      // Convertir les deux dates en "yyyy-MM-dd" pour ne prendre en compte que la date
      const scheduleDate = new Date(schedule.date).toISOString().slice(0, 10); // extrait "yyyy-MM-dd"
      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
      return scheduleDate === selectedDateFormatted;
    });

    setIsCompleting(true);
    setTimeout(() => {
      if (scheduleForSelectedDate) {
        if (currentTask) {
          dispatch(
            editTask({ _id: scheduleForSelectedDate._id, task: task as Task })
          );
        } else {
          dispatch(
            addTaskToSchedule({ scheduleId: scheduleForSelectedDate._id, task })
          );
        }
      } else {
        dispatch(
          createSchedule({
            date: format(selectedDate, "yyyy-MM-dd"),
            tasks: [task],
          })
        );
      }
      setIsCompleting(false);
      setShowTaskModal(false);
    }, 1000);

    dispatch(fetchSchedules());
    setCurrentTask(null);
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
    dispatch(deleteTask({ scheduleId, taskId }));
    dispatch(fetchSchedules());
  };
  const handleStatusChange = (taskId: string, newStatus: "complet") => {
    const scheduleForSelectedDate = getScheduleForDate(selectedDate, schedules);
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
  const formatTimeForInput = (dateOrString?: Date | string): string => {
    if (!dateOrString) return "";

    // Si c'est une chaîne, on la convertit en Date
    const date =
      typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;

    // Formater l'heure et les minutes
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [startTime, setStartTime] = useState<string | undefined>(
    currentTask?.startTime
      ? formatTimeForInput(currentTask.startTime)
      : undefined
  );
  const [endTime, setEndTime] = useState<string | undefined>(
    currentTask?.endTime ? formatTimeForInput(currentTask.endTime) : undefined
  );

  useEffect(() => {
    if (currentTask) {
      setStartTime(formatTimeForInput(currentTask.startTime));
      setEndTime(formatTimeForInput(currentTask.endTime));
    }
  }, [currentTask]);

  const previousDaySchedule = getScheduleForDate(
    subDays(selectedDate, 1),
    schedules
  );
  const schedule = getScheduleForDate(selectedDate, schedules);
  const tasks = schedule?.tasks || [];
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

        <Card className="bg-indigo-50 dark:bg-[#272B3B]">
          <CardHeader>
            <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
              Yesterday's Recap
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previousDaySchedule && previousDaySchedule.tasks.length > 0 ? (
              <ul className="space-y-2">
                {previousDaySchedule.tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      setCurrentTask(task);
                      setShowTaskUpdateModal(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <CircleDot
                      className={`h-4 w-4 mr-2 ${
                        task.status === "complet"
                          ? "text-green-500"
                          : task.status === "en cours"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                    <span>{task.title}</span>
                  </motion.div>
                ))}
              </ul>
            ) : (
              <NoScheduleMessage message="No tasks were planned for yesterday." />
            )}
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 dark:bg-[#272B3B]">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-[#272B3B] dark:text-[#A8DCE7]">
              <span>Today's Plan</span>
              <Button
                onClick={() => setShowTaskModal(true)}
                className="bg-[#272B3B] text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-[#272B3B] dark:bg-[#A8DCE7] dark:text-[#272B3B] dark:hover:bg-[#272B3B] dark:hover:text-[#A8DCE7] rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task._id}
                  className="flex items-center justify-between mb-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      setCurrentTask(task);
                      setShowTaskUpdateModal(true);
                    }}
                  >
                    <CircleDot
                      className={`h-4 w-4 mr-2 ${
                        task.status === "complet"
                          ? "text-green-500"
                          : task.status === "en cours"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                    <span>{task.title}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentTask(task);
                        setShowTaskModal(true);
                      }}
                      className="hover:bg-[#A8DCE7] hover:text-[#101422] transition-colors duration-200 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaskToDelete(task);
                        setOnDeleting(true);
                      }}
                      className="hover:bg-red-500 hover:text-accent transition-colors duration-200 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <NoScheduleMessage message="No tasks planned for today. Add some tasks to get started!" />
            )}
          </CardContent>
        </Card>
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
          <Modal
            isOpen={showTaskModal}
            onClose={() => {
              setCurrentTask(null);
              setShowTaskModal(false);
            }}
          >
            <div className="bg-[#FFFFFF] dark:bg-[#272B3B] p-6 rounded-lg shadow-lg">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
                <h1 className="text-2xl font-bold text-[#101422] dark:text-[#A8DCE7]">
                  {currentTask ? "Edit Task" : "Add New Task"}
                </h1>
                <h2 className="text-sm text-[#272B3B] dark:text-[#FFFFFF]/70">
                  {currentTask
                    ? "Edit the details of your task below."
                    : "Fill out the form to add a new task."}
                </h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newTask: TaskWithOptionalId = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    priority: formData.get("priority") as
                      | "haute"
                      | "moyenne"
                      | "basse",
                    status: formData.get("status") as
                      | "à faire"
                      | "en cours"
                      | "complet",
                    estimatedTime: Number(formData.get("estimatedTime")),
                    startTime: startTime
                      ? new Date(`1970-01-01T${startTime}:00`)
                      : undefined,
                    endTime: endTime
                      ? new Date(`1970-01-01T${endTime}:00`)
                      : undefined,
                    ...(currentTask?._id && { _id: currentTask._id }),
                  };

                  handleAddOrEditTask(newTask);
                }}
                className="space-y-6"
              >
                <div>
                  <Label
                    htmlFor="title"
                    className="text-[#101422] dark:text-[#A8DCE7]"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentTask?.title}
                    required
                    className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-[#101422] dark:text-[#A8DCE7]"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentTask?.description}
                    className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="priority"
                    className="text-[#101422] dark:text-[#A8DCE7]"
                  >
                    Priority
                  </Label>
                  <Select
                    name="priority"
                    defaultValue={currentTask?.priority || "moyenne"}
                  >
                    <SelectTrigger className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
                      <SelectItem value="haute">High</SelectItem>
                      <SelectItem value="moyenne">Medium</SelectItem>
                      <SelectItem value="basse">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="status"
                    className="text-[#101422] dark:text-[#A8DCE7]"
                  >
                    Status
                  </Label>
                  <Select
                    name="status"
                    defaultValue={currentTask?.status || "à faire"}
                  >
                    <SelectTrigger className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
                      <SelectItem value="à faire">To Do</SelectItem>
                      <SelectItem value="en cours">In Progress</SelectItem>
                      <SelectItem value="complet">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="estimatedTime"
                    className="text-[#101422] dark:text-[#A8DCE7]"
                  >
                    Estimated Time (minutes)
                  </Label>
                  <Input
                    type="number"
                    id="estimatedTime"
                    name="estimatedTime"
                    defaultValue={currentTask?.estimatedTime}
                    required
                    className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="startTime"
                      className="text-[#101422] dark:text-[#A8DCE7]"
                    >
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={startTime || ""}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="endTime"
                      className="text-[#101422] dark:text-[#A8DCE7]"
                    >
                      End Time
                    </Label>
                    <Input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={endTime || ""}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isCompleting}
                  className="w-full bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-[#A8DCE7] mt-4 transition-colors duration-200"
                >
                  {isCompleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  {currentTask ? "Update Task" : "Add Task"}
                </Button>
              </form>
            </div>
          </Modal>
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
