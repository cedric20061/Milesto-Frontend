import { DailySchedule } from "@/types";
import { format } from "date-fns";

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

export const getScheduleForDate = (date: Date, schedules: DailySchedule[]): DailySchedule | undefined => {
  return schedules.find((schedule) => {
    const scheduleDate = format(new Date(schedule.date), "yyyy-MM-dd");
    const targetDate = format(date, "yyyy-MM-dd");
    return scheduleDate === targetDate;
  });
};