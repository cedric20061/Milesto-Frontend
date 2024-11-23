import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trash2,
  Edit,
  CheckCircle,
  Circle,
  Calendar,
  Flag,
  Clock,
  Target,
  AlertTriangle,
} from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { removeGoal } from "@/features/goals/goalsSlice";
import { Goals as Goal } from "@/types/index";
import Modal from "@/components/app/Modal";
import VerificationDisplayer from "./VerificationDisplayer";
import GoalForm from "./GoalForm";
import { translateToFrench } from "@/utils/function";

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [onDeleting, setOnDeleting] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    await dispatch(removeGoal(id));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "haute":
        return "text-[#FF0000]";
      case "moyenne":
        return "text-[#FFA500]";
      case "basse":
        return "text-[#008000]";
      default:
        return "text-[#272B3B] dark:text-[#A8DCE7]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "non démarré":
        return (
          <Circle className="h-4 w-4 text-[#272B3B] dark:text-[#A8DCE7]" />
        );
      case "en cours":
        return <Clock className="h-4 w-4 text-[#A8DCE7] dark:text-[#FFFFFF]" />;
      case "complet":
        return <CheckCircle className="h-4 w-4 text-[#008000]" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-[#FFA500]" />;
    }
  };

  return (
    <>
      <Card
        onClick={openModal}
        className="mb-4 bg-indigo-50 dark:bg-[#272B3B] cursor-pointer transition-all duration-300 hover:shadow-lg border-[#A8DCE7] dark:border-[#101422] hover:border-[#272B3B] dark:hover:border-[#A8DCE7]"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-[#101422] dark:text-[#A8DCE7] flex justify-between items-center">
            <span className="flex items-center text-lg font-semibold">
              <Target className="mr-2 h-5 w-5" />
              {goal.title}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditMode(true);
                  openModal();
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
                  setOnDeleting(true);
                }}
                className="hover:bg-[#FF0000] hover:text-[#FFFFFF] transition-colors duration-200 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#272B3B] dark:text-[#FFFFFF] mb-3 line-clamp-2">
            {goal.description}
          </p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-[#101422] dark:text-[#A8DCE7] flex items-center bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full">
              <Flag className="mr-1 h-3 w-3" /> {goal.category}
            </span>
            <span className="text-xs text-[#101422] dark:text-[#A8DCE7] flex items-center bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full">
              <Calendar className="mr-1 h-3 w-3" />{" "}
              {new Date(goal.targetDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-xs flex items-center ${getPriorityColor(
                goal.priority
              )} bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full`}
            >
              <AlertTriangle className="mr-1 h-3 w-3" /> {translateToFrench(goal.priority)}
            </span>
            <span className="text-xs text-[#101422] dark:text-[#A8DCE7] flex items-center bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full">
              {getStatusIcon(goal.status)}{" "}
              <span className="ml-1">{translateToFrench(goal.status)}</span>
            </span>
          </div>
          <Progress
            value={goal.progress}
            className="w-full mt-2 bg-[#A8DCE7] dark:bg-[#101422]"
            indicatorClassName="bg-[#272B3B] dark:bg-[#A8DCE7]"
          />
          <p className="text-sm text-[#272B3B] dark:text-[#A8DCE7] mt-1">
            {goal.progress}% complete
          </p>
        </CardContent>
      </Card>

      <AnimatePresence>
        {onDeleting && (
          <Modal isOpen={onDeleting} onClose={() => setOnDeleting(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FFFFFF] dark:bg-[#272B3B] rounded-lg p-6 max-w-2xl w-full mx-auto shadow-xl"
            >
              <VerificationDisplayer
                validFonction={() => goal._id && handleDelete(goal._id)}
                onClose={() => setOnDeleting(false)}
              >
                <p className="text-[#101422] dark:text-[#A8DCE7] text-lg font-semibold mb-4">
                  Are you sure you want to delete this goal?
                </p>
                <p className="text-[#272B3B] dark:text-[#FFFFFF]/80 mb-6">
                  This action cannot be undone.
                </p>
              </VerificationDisplayer>
            </motion.div>
          </Modal>
        )}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FFFFFF] dark:bg-[#272B3B] rounded-lg p-6 max-w-2xl w-full mx-auto shadow-xl"
            >
              {isEditMode ? (
                <GoalForm goal={goal} onClose={() => setIsEditMode(false)} />
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#101422] dark:text-[#A8DCE7] mb-4 flex items-center">
                    <Target className="mr-2 h-6 w-6" />
                    {goal.title}
                  </h2>
                  <p className="text-[#272B3B] dark:text-[#FFFFFF] mb-6">
                    {goal.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1">
                        Category
                      </p>
                      <p className="text-[#272B3B] dark:text-[#FFFFFF] bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full inline-block">
                        {goal.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1">
                        Priority
                      </p>
                      <p
                        className={`${getPriorityColor(
                          goal.priority
                        )} bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full inline-block`}
                      >
                        {translateToFrench(goal.priority)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1">
                        Status
                      </p>
                      <p className="text-[#272B3B] dark:text-[#FFFFFF] flex items-center bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full">
                        {getStatusIcon(goal.status)}
                        <span className="ml-1">{translateToFrench(goal.status)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1">
                        Target Date
                      </p>
                      <p className="text-[#272B3B] dark:text-[#FFFFFF] bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 px-2 py-1 rounded-full inline-block">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-2">
                      Progress
                    </p>
                    <Progress
                      value={goal.progress}
                      className="w-full mt-2 bg-[#A8DCE7] dark:bg-[#101422]"
                      indicatorClassName="bg-[#272B3B] dark:bg-[#A8DCE7]"
                    />
                    <p className="text-sm text-[#101422] dark:text-[#A8DCE7] mt-2 font-medium">
                      {goal.progress || 0}% complete
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-2">
                      Milestones
                    </p>
                    <ul className="space-y-2">
                      {goal.milestones.map((milestone, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-2 bg-[#A8DCE7]/20 dark:bg-[#A8DCE7]/10 p-2 rounded-lg"
                        >
                          {milestone.status == "complet" ? (
                            <CheckCircle className="h-5 w-5 text-[#008000] flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-[#272B3B] dark:text-[#A8DCE7] flex-shrink-0" />
                          )}
                          <span
                            className={`text-[#272B3B] dark:text-[#FFFFFF] flex-grow ${
                              milestone.status == "complet"
                                ? "line-through"
                                : ""
                            }`}
                          >
                            {milestone.title}
                          </span>
                          <span className="text-xs text-[#101422] dark:text-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#272B3B] px-2 py-1 rounded-full">
                            {new Date(
                              milestone.targetDate
                            ).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-[#101422] dark:text-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#272B3B] px-2 py-1 rounded-full">
                            {translateToFrench(milestone.status)}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={closeModal}
                      className="bg-indigo-50 text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7] dark:hover:bg-[#FFFFFF] dark:hover:text-[#101422] transition-colors duration-200"
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default GoalCard;
