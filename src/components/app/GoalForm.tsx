"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/app/hooks";
import { createGoal, editGoal, fetchGoals } from "@/features/goals/goalsSlice";
import { Goals as Goal, Milestone } from "@/types/index";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface GoalFormInterface {
  goal: Goal | null;
  onClose: () => void;
}

type Status = "non démarré" | "en cours" | "complet";
type Priority = "haute" | "moyenne" | "basse";

const GoalForm: React.FC<GoalFormInterface> = ({ goal, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("moyenne");
  const [status, setStatus] = useState<Status>("non démarré");
  const [isCompleting, setIsCompleting] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Goal>(
    goal || {
      _id: "",
      userId: "",
      title: "",
      description: "",
      category: "",
      priority: "moyenne",
      status: "non démarré",
      milestones: [],
      progress: 0,
      targetDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
  const [targetDate, setTargetDate] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    title: "",
    description: "",
    targetDate: new Date(),
    completed: false,
    everyDayAction: false,
    status: "non démarré",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedGoal((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsCompleting(true);
    e.preventDefault();
    const newGoal: Goal = {
      title,
      description,
      category,
      priority,
      status,
      targetDate: new Date(targetDate),
      milestones,
      progress: 0,
      userId: "",
      createdAt: goal?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    setTimeout(async () => {
      await dispatch(createGoal(newGoal));
      setIsCompleting(false);
      onClose();
    }, 1000);
    onClose();
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, newMilestone]);
    setNewMilestone({
      title: "",
      description: "",
      completed: false,
      targetDate: new Date(),
      everyDayAction: false,
      status: "non démarré",
    });
  };

  const handleEdit = async () => {
    setIsCompleting(true);
    setTimeout(async () => {
      await dispatch(editGoal(editedGoal));
      setIsCompleting(false);
      onClose();
    }, 1000);
    dispatch(fetchGoals());
    onClose();
  };

  return !goal ? (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-[#101422] dark:text-[#A8DCE7]">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
        />
      </div>
      <div>
        <Label
          htmlFor="category"
          className="text-[#101422] dark:text-[#A8DCE7]"
        >
          Category
        </Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
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
          value={priority}
          onValueChange={(value) => setPriority(value as Priority)}
        >
          <SelectTrigger className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]">
            <SelectValue placeholder="Select a priority" />
          </SelectTrigger>
          <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
            <SelectItem value="haute">High</SelectItem>
            <SelectItem value="moyenne">Medium</SelectItem>
            <SelectItem value="basse">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status" className="text-[#101422] dark:text-[#A8DCE7]">
          Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as Status)}
        >
          <SelectTrigger className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
            <SelectItem value="non démarré">Non démarré</SelectItem>
            <SelectItem value="en cours">In progress</SelectItem>
            <SelectItem value="complet">Finished</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label
          htmlFor="targetDate"
          className="text-[#101422] dark:text-[#A8DCE7]"
        >
          Target Date
        </Label>
        <Input
          id="targetDate"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
          className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-[#101422] dark:text-[#A8DCE7]">
          Milestones
        </h3>
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="border border-[#A8DCE7] dark:border-[#101422] p-2 rounded space-y-2 bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7]"
          >
            <p>
              <strong>Title:</strong> {milestone.title}
            </p>
            <p>
              <strong>Description:</strong> {milestone.description}
            </p>
            <p>
              <strong>Target Date:</strong>{" "}
              {new Date(milestone.targetDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {milestone.status}
            </p>
          </div>
        ))}
        <div className="space-y-2">
          <Input
            placeholder="Milestone Title"
            value={newMilestone.title}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, title: e.target.value })
            }
            className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
          />
          <Textarea
            placeholder="Milestone Description"
            value={newMilestone.description}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, description: e.target.value })
            }
            className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
          />
          <Input
            type="date"
            placeholder="Milestone Target Date"
            value={newMilestone.targetDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setNewMilestone({
                ...newMilestone,
                targetDate: new Date(e.target.value),
              })
            }
            className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]"
          />

          <Select
            value={newMilestone.status}
            onValueChange={(status) =>
              setNewMilestone({ ...newMilestone, status })
            }
          >
            <SelectTrigger className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]">
              <SelectValue placeholder="Select milestone status" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
              <SelectItem value="non démarré">Not start</SelectItem>
              <SelectItem value="en cours">In progress</SelectItem>
              <SelectItem value="complet">Finished</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAddMilestone}
            className="mt-2 bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-[#A8DCE7] rounded-full"
          >
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isCompleting}
          className="bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-[#A8DCE7] rounded-full"
        >
          {isCompleting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <CheckCircle className="h-5 w-5" />
            </motion.div>
          ) : (
            <CheckCircle className="h-5 w-5 mr-2" />
          )}
          Save
        </Button>
      </div>
    </form>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleEdit();
      }}
    >
      <Input
        name="title"
        value={editedGoal.title}
        onChange={handleInputChange}
        className="text-2xl font-bold text-[#101422] dark:text-[#A8DCE7] mb-4 w-full bg-transparent border-b border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
      />
      <Textarea
        name="description"
        value={editedGoal.description}
        onChange={handleInputChange}
        className="text-[#272B3B] dark:text-[#FFFFFF] mb-6 w-full bg-transparent border border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
      />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1 block">
            Category
          </label>
          <Input
            name="category"
            value={editedGoal.category}
            onChange={handleInputChange}
            className="text-[#272B3B] dark:text-[#FFFFFF] bg-transparent border border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1 block">
            Priority
          </label>
          <Select
            name="priority"
            value={editedGoal.priority}
            onValueChange={(value) =>
              setEditedGoal((prev) => ({
                ...prev,
                priority: value as Priority,
              }))
            }
          >
            <SelectTrigger className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]">
              <SelectValue placeholder="Select new priority" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
              <SelectItem value="haute">High</SelectItem>
              <SelectItem value="moyennne">Medium</SelectItem>
              <SelectItem value="base">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1 block">
            Status
          </label>
          <Select
            name="status"
            value={editedGoal.status}
            onValueChange={(value) =>
              setEditedGoal((prev) => ({ ...prev, status: value as Status }))
            }
          >
            <SelectTrigger className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]">
              <SelectValue placeholder="Select milestone status" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
              <SelectItem value="non démarré">Not started</SelectItem>
              <SelectItem value="en cours">In Progress</SelectItem>
              <SelectItem value="complet">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-1 block">
            Target Date
          </label>
          <Input
            type="date"
            name="targetDate"
            value={new Date(editedGoal.targetDate).toISOString().split("T")[0]}
            onChange={handleInputChange}
            className="text-[#272B3B] dark:text-[#FFFFFF] bg-transparent border border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-[#101422] dark:text-[#A8DCE7] mb-2 block">
          Milestones
        </label>
        {editedGoal.milestones.map((milestone, index) => (
          <div key={index} className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <Input
                value={milestone.title}
                onChange={(e) => {
                  const updatedMilestones = editedGoal.milestones.map(
                    (item, idx) => {
                      if (idx === index) {
                        return { ...item, title: e.target.value }; // Crée une copie de l'objet à l'index et met à jour le title
                      }
                      return item; // Conserve les autres éléments inchangés
                    }
                  );

                  // Mettez à jour l'état avec la nouvelle copie du tableau
                  setEditedGoal((prev) => ({
                    ...prev,
                    milestones: updatedMilestones,
                  }));
                }}
                className="text-[#272B3B] dark:text-[#FFFFFF] flex-grow bg-transparent border border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
              />

              <Input
                type="date"
                value={
                  new Date(milestone.targetDate).toISOString().split("T")[0]
                }
                onChange={(e) => {
                  const updatedMilestones = [...editedGoal.milestones];
                  updatedMilestones[index].targetDate = new Date(
                    e.target.value
                  );
                  setEditedGoal((prev) => ({
                    ...prev,
                    milestones: updatedMilestones,
                  }));
                }}
                className="text-[#272B3B] dark:text-[#FFFFFF] w-32 bg-transparent border border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
              />
              <Select
                value={milestone.status}
                onValueChange={(value) => {
                  setEditedGoal((prev) => ({
                    ...prev,
                    milestones: prev.milestones.map((milestone, idx) =>
                      idx === index
                        ? { ...milestone, status: value }
                        : milestone
                    ),
                  }));
                }}
              >
                <SelectTrigger className="bg-[#FFFFFF] dark:bg-[#272B3B] text-[#101422] dark:text-[#A8DCE7] border-[#A8DCE7] dark:border-[#101422]">
                  <SelectValue placeholder="Select milestone status" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-50 dark:bg-[#101422] dark:text-[#A8DCE7]">
                  <SelectItem value="non démarré">Not start</SelectItem>
                  <SelectItem value="en cours">In progress</SelectItem>
                  <SelectItem value="complet">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={milestone.description || ""}
              onChange={(e) => {
                const updatedMilestones = [...editedGoal.milestones];
                updatedMilestones[index] = {
                  ...updatedMilestones[index],
                  description: e.target.value,
                };
                setEditedGoal((prev) => ({
                  ...prev,
                  milestones: updatedMilestones,
                }));
              }}
              placeholder="Add a description"
              className="text-[#272B3B] dark:text-[#FFFFFF] w-full bg-transparent border border-[#A8DCE7]/50 dark:border-[#101422]/50 focus:border-[#272B3B] dark:focus:border-[#A8DCE7] transition-colors duration-200"
            />

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-[#101422] dark:text-[#A8DCE7]">
                Every Day Action
              </label>

              <Input
                type="checkbox"
                checked={
                  milestone.everyDayAction !== undefined
                    ? milestone.everyDayAction
                    : false
                }
                onChange={() => {
                  if (milestone.status === "complet") {
                    return;
                  }
                  const updatedMilestones = [...editedGoal.milestones];
                  updatedMilestones[index] = {
                    ...updatedMilestones[index],
                    everyDayAction: !milestone.everyDayAction,
                  };
                  setEditedGoal((prev) => ({
                    ...prev,
                    milestones: updatedMilestones,
                  }));
                }}
                disabled={milestone.status === "complet"}
                className="form-checkbox h-5 w-5 text-[#101422] dark:text-[#A8DCE7] rounded border-[#A8DCE7]/50 dark:border-[#101422]/50"
              />

              {milestone.status === "complet" && (
                <p className="text-xs text-[#FF0000]">
                  You cannot modify the 'Every Day Action' when the milestone is
                  complete.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button
          onClick={() => onClose()}
          className="bg-[#272B3B] text-[#FFFFFF] hover:bg-[#A8DCE7] hover:text-[#101422] transition-colors duration-200 rounded-full"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCompleting}
          className="bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-[#FFFFFF] transition-colors duration-200 rounded-full"
        >
          {isCompleting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <CheckCircle className="h-5 w-5" />
            </motion.div>
          ) : (
            <CheckCircle className="h-5 w-5 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
