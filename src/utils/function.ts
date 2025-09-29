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

  // ✅ Si c'est une chaîne au format "HH:mm", on la retourne telle quelle
  if (typeof dateOrString === "string" && /^\d{2}:\d{2}$/.test(dateOrString)) {
    return dateOrString;
  }

  // ✅ Sinon, si c'est une date ou une chaîne de date complète
  const date =
    typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;

  if (isNaN(date.getTime())) return ""; // ⛔ Gérer les dates invalides

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};


