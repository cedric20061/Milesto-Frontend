"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function PomodoroTimer() {
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="bg-indigo-50 dark:bg-[#272B3B]">
      <CardHeader>
        <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-4xl font-bold mb-4 text-[#272B3B] dark:text-[#A8DCE7]">
            {formatTime(pomodoroTime)}
          </div>
          <div className="space-x-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-[#272B3B] text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-[#272B3B] dark:bg-[#A8DCE7] dark:text-[#272B3B] dark:hover:bg-[#272B3B] dark:hover:text-[#A8DCE7]"
            >
              {isRunning ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={() => {
                setPomodoroTime(25 * 60);
                setIsRunning(false);
              }}
              className="bg-[#A8DCE7] text-[#272B3B] hover:bg-[#272B3B] hover:text-[#A8DCE7] dark:bg-[#272B3B] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#272B3B]"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
