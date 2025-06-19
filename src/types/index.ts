export interface Goals {
  _id?: string;
  userId: string; // Référence vers l'ID de l'utilisateur
  title: string;
  description: string;
  category: string;
  step: number;
  priority: "haute" | "moyenne" | "basse";
  status: "non démarré" | "en cours" | "complet";
  progress:  number;
  targetDate: Date;
  dependencies?: string[]; // Références vers les IDs d'autres objectifs
  milestones: Milestone[]; // Liste des jalons associés à l'objectif
  createdAt: Date;
  updatedAt: Date;
}
export interface Milestone {
  everyDayAction: boolean;
  _id?: string;
  title: string;
  step: number;
  description?: string;
  completed: boolean;
  status: string,
  targetDate: Date;
}
export interface TaskItemProps {
  task: Milestone;
  completed: boolean;
  onToggle: () => void;
}
export type TaskWithOptionalId = Partial<Pick<Task, "_id">> & Omit<Task, "_id">;
// Task interface represents individual tasks within a daily schedule
export interface Task {
  _id: string; // Unique identifier for the task
  title: string; // Title of the task
  description?: string; // Optional description of the task
  priority: "haute" | "moyenne" | "basse"; // Priority level
  status: "à faire" | "en cours" | "complet"; // Task status
  estimatedTime: number; // Estimated time in minutes
  startTime?: string; // Optional start time
  endTime?: string; // Optional end time
}

// DailySchedule interface represents the daily schedule structure
export interface DailySchedule {
  _id: string; // Unique identifier for the schedule
  userId: string; // User's ID reference
  date: string; // Date of the daily schedule
  tasks: Task[]; // List of tasks for the day
  createdAt: Date; // Creation date of the schedule
}

export interface DailyScheduleState {
  schedules: DailySchedule[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  password: string;
}
