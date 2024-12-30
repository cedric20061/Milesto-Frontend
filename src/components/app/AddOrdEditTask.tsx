import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Task, TaskWithOptionalId } from "@/types";
import {
  addTaskToSchedule,
  createSchedule,
  editTask,
  fetchSchedules,
} from "@/features/dailySchedule/dailyScheduleSlice";
import { format } from "date-fns";
import { formatTimeForInput } from "@/utils/function";

interface Props {
  currentTask: Task | null;
  selectedDate: Date;
  showTaskModal: boolean;
  setShowTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
}
const AddOrdEditTask: React.FC<Props> = ({
  currentTask,
  selectedDate,
  showTaskModal,
  setShowTaskModal,
  setCurrentTask,
}) => {
  const dispatch = useAppDispatch();
  const { schedules } = useAppSelector(
    (state: RootState) => state.dailySchedule
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [startTime, setStartTime] = useState<string | undefined>(
    currentTask?.startTime
      ? formatTimeForInput(currentTask.startTime)
      : undefined
  );
  const [endTime, setEndTime] = useState<string | undefined>(
    currentTask?.endTime ? formatTimeForInput(currentTask.endTime) : undefined
  );
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    // Calculer la différence entre `startTime` et `endTime`
    if (startTime && endTime) {
      const start = Number(new Date(`1970-01-01T${startTime}:00`));
      const end = Number(new Date(`1970-01-01T${endTime}:00`));

      if (end > start) {
        const diff = Math.round((end - start) / (1000 * 60)); // Différence en minutes
        setEstimatedTime(String(diff));
      } else {
        setEstimatedTime(""); // Réinitialiser en cas d'incohérence
      }
    } else {
      setEstimatedTime("");
    }
  }, [startTime, endTime]);
  useEffect(() => {
    if (currentTask) {
      setStartTime(formatTimeForInput(currentTask.startTime));
      setEndTime(formatTimeForInput(currentTask.endTime));
    }
  }, [currentTask]);
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
  return (
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
              startTime: startTime,
              endTime: endTime,
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
          {startTime && endTime && startTime >= endTime && (
            <p className="text-red-500 mt-2">
              L'heure de fin doit être postérieure à l'heure de début.
            </p>
          )}
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
              value={estimatedTime || ""}
              readOnly
              className="mt-1 bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#272B3B]"
            />
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
  );
};

export default AddOrdEditTask;
