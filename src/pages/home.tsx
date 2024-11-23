import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  CheckCircle2,
  Target,
  ChevronRight,
  PlusCircle,
  Frown,
} from "lucide-react";
import { DailySchedule, Milestone, Task } from "@/types";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Goals as Goal } from "@/types/index";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { RootState } from "@/app/store";
import { fetchSchedules } from "@/features/dailySchedule/dailyScheduleSlice";
import { getScheduleForDate } from "@/utils/function";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "@/features/auth/authSlice";

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 bg-indigo-50 dark:bg-[#272B3B] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7] flex justify-between items-center">
          <span className="text-lg font-semibold">{goal.title}</span>
          <ChevronRight
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress
          value={goal.progress}
          className="w-full mt-2 bg-[#A8DCE7] dark:bg-[#101422]"
          indicatorClassName="bg-[#272B3B] dark:bg-[#A8DCE7]"
        />
        <p className="text-sm text-[#272B3B] dark:text-[#A8DCE7] mt-2 font-medium">
          {goal.progress}% complete
        </p>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-semibold mt-4 mb-2 text-[#272B3B] dark:text-[#A8DCE7]">
                Milestones:
              </h4>
              <ul className="space-y-2">
                {goal.milestones.map((milestone: Milestone, index: number) => (
                  <li key={index} className="flex items-center">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <Target className="h-5 w-5 text-[#A8DCE7] dark:text-indigo-50 mr-2 flex-shrink-0" />
                    )}
                    <span
                      className={`${
                        milestone.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-[#101422] dark:text-indigo-50"
                      }`}
                    >
                      {milestone.title}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const NoSchedule: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-64 text-center space-y-6 bg-indigo-50 dark:bg-[#272B3B] rounded-lg shadow-lg p-8 mb-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Frown className="w-16 h-16 text-[#A8DCE7] dark:text-indigo-50" />
      </motion.div>
      <motion.h2
        className="text-2xl font-semibold text-[#272B3B] dark:text-[#A8DCE7]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        No planning for today
      </motion.h2>
      <motion.p
        className="text-[#101422] dark:text-[#A8DCE7]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Add tasks to start organizing your day!
      </motion.p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button
          className="flex items-center space-x-2 bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B] px-6 py-3 rounded-full transition-all duration-300"
          onClick={() => navigate("/day-planning")}
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create a schedule</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

const NoGoals: React.FC = () => {
  const navigate = useNavigate();

  return (
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
        <Target className="w-16 h-16 text-[#A8DCE7] dark:text-indigo-50" />
      </motion.div>
      <motion.h2
        className="text-2xl font-semibold text-[#272B3B] dark:text-[#A8DCE7]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        No defined objective
      </motion.h2>
      <motion.p
        className="text-[#101422] dark:text-[#A8DCE7]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Start by setting your goals to track your progress!
      </motion.p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button
          className="flex items-center space-x-2 bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B] px-6 py-3 rounded-full transition-all duration-300"
          onClick={() => navigate("/goals")}
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add a goal</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { goals, status } = useAppSelector((state) => state.goals);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const { schedules } = useAppSelector(
    (state: RootState) => state.dailySchedule
  );
  const [todaySchedule, setTodaySchedule] = useState<DailySchedule | undefined>(
    undefined
  );
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGoals());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setTodaySchedule(getScheduleForDate(new Date(), schedules));
  }, [schedules]);

  const getSortedTasks = (tasks: Task[], maxTasks: number): Task[] => {
    const priorities = ["haute", "moyenne", "basse"];
    let sortedTasks: Task[] = [];

    for (const priority of priorities) {
      const filteredTasks = tasks.filter((task) => task.priority === priority);
      sortedTasks = [...sortedTasks, ...filteredTasks];
      if (sortedTasks.length >= maxTasks) break;
    }

    return sortedTasks.slice(0, maxTasks);
  };

  const calculateProgress = (tasks: Task[]): number => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "complet"
    ).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const displayedTasks = todaySchedule
    ? getSortedTasks(todaySchedule.tasks, 5)
    : [];
  const progress = todaySchedule ? calculateProgress(todaySchedule.tasks) : 0;

  return (
    <>
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#272B3B] dark:text-[#A8DCE7]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome,{" "}
        <span className="text-[#A8DCE7] dark:text-indigo-50">
          {user?.name || "User"}
        </span>{" "}
        !
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {displayedTasks.length > 0 ? (
          <Card className="mb-8 bg-[#A8DCE7] dark:bg-[#272B3B] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#101422] dark:text-[#A8DCE7] text-2xl">
                Today Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-[#272B3B] dark:text-[#A8DCE7] text-lg">
                    Daily Progression
                  </h3>
                  <Progress
                    value={progress}
                    className="w-full h-3 bg-indigo-50 dark:bg-[#101422]"
                    indicatorClassName="bg-[#272B3B] dark:bg-[#A8DCE7]"
                  />
                  <p className="text-sm font-medium text-[#272B3B] dark:text-[#A8DCE7] mt-2">
                    {progress.toFixed(0)}% daily goals achieved
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-[#272B3B] dark:text-[#A8DCE7] text-lg">
                    Main tasks for today
                  </h3>
                  <ul className="space-y-3">
                    {displayedTasks.map((task) => (
                      <li
                        className="flex items-center bg-indigo-50 dark:bg-[#101422] p-3 rounded-md shadow"
                        key={task._id}
                      >
                        {task.status === "complet" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        )}
                        {task.status === "en cours" && (
                          <Target className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                        )}
                        {task.status === "à faire" && (
                          <Target className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        )}
                        <span className="text-[#101422] dark:text-indigo-50">
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <NoSchedule />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mb-8 bg-indigo-50 dark:bg-[#272B3B] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7] text-2xl">
              Main objectives Highlight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              if (!goals || goals.length === 0) {
                return <NoGoals />;
              }

              const sortedGoals = [...goals].sort((a, b) => {
                const priorityMap = { haute: 3, moyenne: 2, basse: 1 };
                return priorityMap[b.priority] - priorityMap[a.priority];
              });

              const topGoals = sortedGoals.slice(0, 5);

              return topGoals.map((goal, index) => (
                <GoalCard key={index} goal={goal} />
              ));
            })()}
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          onClick={() => navigate("/goals")}
          className="w-full bg-[#272B3B] hover:bg-[#A8DCE7] text-indigo-50 hover:text-[#101422] dark:bg-[#A8DCE7] dark:hover:bg-indigo-50 dark:text-[#101422] dark:hover:text-[#272B3B] transition-colors duration-300 py-3 text-lg font-medium rounded-full shadow-lg"
        >
          See all lenses
        </Button>
      </motion.div>
    </>
  );
}
