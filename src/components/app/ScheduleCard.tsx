import React from "react";
import { motion } from "framer-motion";
import { CircleDot, Edit, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NoScheduleMessage from "@/components/app/NoScheduleMessage";
import { DailySchedule, Task } from "@/types";

interface ScheduleCardProps {
  type: "yesterday" | "today";
  schedule: DailySchedule | undefined;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowTaskUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskToDelete: React.Dispatch<React.SetStateAction<Task | null>>;
  setOnDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}
const ScheduleCard: React.FC<ScheduleCardProps> = ({
  type,
  schedule,
  setCurrentTask,
  setShowTaskUpdateModal,
  setShowTaskModal,
  setTaskToDelete,
  setOnDeleting,
}) => {
  if (type === "yesterday") {
    return (
      <Card className="bg-indigo-50 dark:bg-[#272B3B]">
        <CardHeader>
          <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
            Yesterday's Recap
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedule && schedule.tasks.length > 0 ? (
            <ul className="space-y-2">
              {schedule.tasks.map((task) => (
                <motion.div
                  key={task._id}
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setCurrentTask(task);
                    setShowTaskUpdateModal(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
    );
  }

  if (type === "today") {
    return (
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
          {schedule && schedule.tasks.length > 0 ? (
            schedule.tasks.map((task) => (
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
    );
  }

  return null;
};

export default ScheduleCard;
