"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  Clock,
  Star,
  Calendar,
  ArrowRight,
  Trophy,
  Flag,
} from "lucide-react";

// Interfaces basées sur votre code
interface Milestone {
  everyDayAction: boolean;
  _id?: string;
  title: string;
  step: number;
  description?: string;
  completed: boolean;
  status: string;
  targetDate: Date;
}

interface Goals {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  step: number;
  priority: "haute" | "moyenne" | "basse";
  status: "non démarré" | "en cours" | "complet";
  progress: number;
  targetDate: Date;
  dependencies?: string[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

// Données d'exemple
const mockGoals: Goals[] = [
  {
    _id: "1",
    userId: "user1",
    title: "Apprendre les bases du développement web",
    description: "Maîtriser HTML, CSS et JavaScript",
    category: "Développement Web",
    step: 1,
    priority: "haute",
    status: "complet",
    progress: 100,
    targetDate: new Date("2024-02-15"),
    milestones: [
      {
        _id: "m1",
        title: "Apprendre HTML",
        step: 1,
        description: "Comprendre la structure HTML",
        completed: true,
        status: "complet",
        everyDayAction: false,
        targetDate: new Date("2024-01-15"),
      },
      {
        _id: "m2",
        title: "Maîtriser CSS",
        step: 2,
        description: "Styliser des pages web",
        completed: true,
        status: "complet",
        everyDayAction: false,
        targetDate: new Date("2024-01-30"),
      },
      {
        _id: "m3",
        title: "JavaScript de base",
        step: 3,
        description: "Variables, fonctions, DOM",
        completed: true,
        status: "complet",
        everyDayAction: false,
        targetDate: new Date("2024-02-15"),
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    _id: "2",
    userId: "user1",
    title: "Frameworks Frontend",
    description: "Apprendre React et ses écosystèmes",
    category: "Développement Web",
    step: 2,
    priority: "haute",
    status: "en cours",
    progress: 60,
    targetDate: new Date("2024-04-01"),
    milestones: [
      {
        _id: "m4",
        title: "React Basics",
        step: 1,
        description: "Components, Props, State",
        completed: true,
        status: "complet",
        everyDayAction: false,
        targetDate: new Date("2024-03-01"),
      },
      {
        _id: "m5",
        title: "React Hooks",
        step: 2,
        description: "useState, useEffect, custom hooks",
        completed: true,
        status: "complet",
        everyDayAction: false,
        targetDate: new Date("2024-03-15"),
      },
      {
        _id: "m6",
        title: "State Management",
        step: 3,
        description: "Redux ou Context API",
        completed: false,
        status: "en cours",
        everyDayAction: false,
        targetDate: new Date("2024-04-01"),
      },
    ],
    createdAt: new Date("2024-02-16"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    _id: "3",
    userId: "user1",
    title: "Backend Development",
    description: "Node.js et bases de données",
    category: "Développement Web",
    step: 3,
    priority: "moyenne",
    status: "non démarré",
    progress: 0,
    targetDate: new Date("2024-06-01"),
    milestones: [
      {
        _id: "m7",
        title: "Node.js Basics",
        step: 1,
        description: "Serveur, modules, npm",
        completed: false,
        status: "non démarré",
        everyDayAction: false,
        targetDate: new Date("2024-04-15"),
      },
      {
        _id: "m8",
        title: "Express.js",
        step: 2,
        description: "Routes, middleware, API",
        completed: false,
        status: "non démarré",
        everyDayAction: false,
        targetDate: new Date("2024-05-01"),
      },
      {
        _id: "m9",
        title: "Base de données",
        step: 3,
        description: "MongoDB ou PostgreSQL",
        completed: false,
        status: "non démarré",
        everyDayAction: false,
        targetDate: new Date("2024-06-01"),
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "complet":
//       return "bg-green-500";
//     case "en cours":
//       return "bg-blue-500";
//     default:
//       return "bg-gray-300";
//   }
// };

const getStatusIcon = (status: string, completed?: boolean) => {
  if (completed || status === "complet") {
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  } else if (status === "en cours") {
    return <Clock className="h-6 w-6 text-blue-500" />;
  } else {
    return <Circle className="h-6 w-6 text-gray-400" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "haute":
      return "bg-red-100 text-red-800";
    case "moyenne":
      return "bg-yellow-100 text-yellow-800";
    case "basse":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function CategoryPathPage() {
  const [selectedCategory] = useState("Développement Web");
  const [goals] = useState<Goals[]>(mockGoals);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  // Trier les goals par étape
  const sortedGoals = goals
    .filter((goal) => goal.category === selectedCategory)
    .sort((a, b) => a.step - b.step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFC] dark:from-[#101422] dark:to-[#1a1f35] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-[#A8DCE7] mr-3" />
            <h1 className="text-3xl font-bold text-[#272B3B] dark:text-[#A8DCE7]">
              Chemin d'Apprentissage
            </h1>
          </div>
          <p className="text-[#272B3B] dark:text-[#FFFFFF] opacity-80">
            {selectedCategory}
          </p>
        </motion.div>

        {/* Path Container */}
        <div className="relative">
          {/* Ligne de connexion principale */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A8DCE7] to-[#272B3B] opacity-30 rounded-full" />

          {/* Goals */}
          <div className="space-y-8">
            {sortedGoals.map((goal, goalIndex) => (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: goalIndex * 0.2 }}
                className="relative"
              >
                {/* Goal Card */}
                <Card className="ml-16 bg-[#FFFFFF] dark:bg-[#272B3B] border-[#A8DCE7] dark:border-[#101422] shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <span className="bg-[#A8DCE7] text-[#101422] px-3 py-1 rounded-full text-sm font-semibold mr-3">
                              Étape {goal.step}
                            </span>
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#272B3B] dark:text-[#A8DCE7] mb-2">
                          {goal.title}
                        </h3>
                        <p className="text-[#272B3B] dark:text-[#FFFFFF] opacity-80 mb-4">
                          {goal.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#272B3B] dark:text-[#FFFFFF]">
                              Progression
                            </span>
                            <span className="text-[#272B3B] dark:text-[#FFFFFF]">
                              {goal.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#A8DCE7] to-[#272B3B] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-[#272B3B] dark:text-[#FFFFFF] opacity-70">
                            <Calendar className="h-4 w-4 mr-1" />
                            {goal.targetDate.toLocaleDateString()}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedGoal(
                                expandedGoal === goal._id ? null : goal._id!
                              )
                            }
                            className="text-[#272B3B] dark:text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-[#101422]"
                          >
                            {expandedGoal === goal._id
                              ? "Masquer"
                              : "Voir les jalons"}
                            <ArrowRight
                              className={`h-4 w-4 ml-1 transition-transform ${
                                expandedGoal === goal._id ? "rotate-90" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goal Status Icon */}
                <div className="absolute left-0 top-6 w-16 h-16 bg-[#FFFFFF] dark:bg-[#272B3B] rounded-full border-4 border-[#A8DCE7] flex items-center justify-center shadow-lg">
                  {getStatusIcon(goal.status)}
                </div>

                {/* Milestones */}
                {expandedGoal === goal._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-24 mt-4 relative"
                  >
                    {/* Ligne de connexion des milestones */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#A8DCE7] opacity-50" />

                    <div className="space-y-4">
                      {goal.milestones
                        .sort((a, b) => a.step - b.step)
                        .map((milestone, milestoneIndex) => (
                          <motion.div
                            key={milestone._id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: milestoneIndex * 0.1 }}
                            className="relative flex items-center"
                          >
                            {/* Milestone Icon */}
                            <div className="w-8 h-8 bg-[#FFFFFF] dark:bg-[#272B3B] rounded-full border-2 border-[#A8DCE7] flex items-center justify-center mr-4 shadow">
                              {getStatusIcon(
                                milestone.status,
                                milestone.completed
                              )}
                            </div>

                            {/* Milestone Content */}
                            <Card className="flex-1 bg-[#F8FAFC] dark:bg-[#1a1f35] border-[#A8DCE7] dark:border-[#272B3B]">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <Flag className="h-4 w-4 text-[#A8DCE7] mr-2" />
                                      <h4 className="font-semibold text-[#272B3B] dark:text-[#A8DCE7]">
                                        {milestone.title}
                                      </h4>
                                      <span className="ml-2 text-xs bg-[#A8DCE7] text-[#101422] px-2 py-1 rounded">
                                        {milestone.step}
                                      </span>
                                    </div>
                                    {milestone.description && (
                                      <p className="text-sm text-[#272B3B] dark:text-[#FFFFFF] opacity-70">
                                        {milestone.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-xs text-[#272B3B] dark:text-[#FFFFFF] opacity-60">
                                    {milestone.targetDate.toLocaleDateString()}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Finish Line */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: sortedGoals.length * 0.2 + 0.5 }}
            className="relative mt-12 text-center"
          >
            <div className="absolute left-8 w-16 h-16 bg-gradient-to-r from-[#A8DCE7] to-[#272B3B] rounded-full flex items-center justify-center shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div className="ml-24">
              <Card className="bg-gradient-to-r from-[#A8DCE7] to-[#272B3B] text-white border-none">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Félicitations !</h3>
                  <p className="opacity-90">
                    Vous avez terminé votre parcours d'apprentissage en{" "}
                    {selectedCategory}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
