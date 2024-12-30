import { DailySchedule } from "@/types";

export function translateToFrench(input: string): string {
  const translations: { [key: string]: string } = {
    moyenne: "Medium",
    haute: "High",
    basse: "Low",
    "en cours": "In progress",
    "non démarré": "Not start",
    complet: "Finished",
    "à faire": "To Do",
  };
  if (typeof input == "number") return input;
  return translations[input.toLowerCase()] || input;
}

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const getScheduleForDate = (
  date: string,
  schedules: DailySchedule[]
): DailySchedule | undefined => {
  return schedules.find((schedule) => schedule.date === date);
};

export const formatTimeForInput = (dateOrString?: Date | string): string => {
  if (!dateOrString) return "";

  // Si c'est une chaîne, on la convertit en Date
  const date =
    typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;

  // Formater l'heure et les minutes
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

