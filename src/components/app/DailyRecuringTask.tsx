"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Milestone } from "@/types"

interface TaskItemProps {
  task: Milestone
  completed?: boolean
  onToggle: () => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, completed, onToggle }) => (
  <div className="flex items-center justify-between space-x-2 py-2">
    <div className="flex items-center space-x-2">
      <Checkbox id={`task-${task._id}`} checked={completed} onCheckedChange={onToggle} />
      <label
        htmlFor={`task-${task._id}`}
        className={`text-sm ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}
      >
        {task.title}
      </label>
    </div>
  </div>
)

interface DailyRecurringTasksProps {
  goals: any[]
  saveTasksToDB: (tasks: Milestone[]) => Promise<void>
  getTasksFromDB: () => Promise<Milestone[]>
  clearDB: () => Promise<void>
}

export default function DailyRecurringTasks({
  goals,
  saveTasksToDB,
  getTasksFromDB,
  clearDB,
}: DailyRecurringTasksProps) {
  const [recurringTasks, setRecurringTasks] = useState<Milestone[]>([])

  useEffect(() => {
    const loadTasks = async () => {
      const tasksFromDB = await getTasksFromDB()

      const dailyMilestones = goals.flatMap((goal) =>
        goal.milestones.filter((milestone: Milestone) => milestone.everyDayAction),
      )

      const validTasks = tasksFromDB.filter((task: Milestone) =>
        dailyMilestones.some(
          (milestone) =>
            milestone._id == task._id &&
            milestone.title === task.title &&
            milestone.description === task.description &&
            new Date(milestone.targetDate).toISOString() === new Date(task.targetDate).toISOString(),
        ),
      )

      const newTasks = dailyMilestones.filter(
        (milestone) =>
          !tasksFromDB.some(
            (task) =>
              milestone.title === task.title &&
              milestone.description === task.description &&
              new Date(milestone.targetDate).toISOString() === new Date(task.targetDate).toISOString(),
          ),
      )

      const updatedRecurringTasks = [...validTasks, ...newTasks]
      setRecurringTasks(updatedRecurringTasks)

      if (newTasks.length > 0 || validTasks.length !== tasksFromDB.length) {
        await saveTasksToDB(updatedRecurringTasks)
      }
    }

    loadTasks()
  }, [goals, saveTasksToDB, getTasksFromDB])

  useEffect(() => {
    const resetTasksAtMidnight = () => {
      const now = new Date()
      const timeUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

      setTimeout(async () => {
        await clearDB()
        const dailyMilestones = goals.flatMap((goal) =>
          goal.milestones.filter((milestone: Milestone) => milestone.everyDayAction),
        )

        setRecurringTasks(dailyMilestones)
      }, timeUntilMidnight)
    }

    resetTasksAtMidnight()
  }, [goals, clearDB])

  const toggleRecurringTask = async (id: string) => {
    setRecurringTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => (task._id === id ? { ...task, completed: !task.completed } : task))
      saveTasksToDB(updatedTasks)
      return updatedTasks
    })
  }

  if (recurringTasks.length === 0) {
    return null
  }

  return (
    <Card className="bg-indigo-50 dark:bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Daily Recurring Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-4">
          {recurringTasks.map((task: Milestone) => (
            <TaskItem
              key={task._id}
              task={task}
              completed={task.completed}
              onToggle={() => task._id && toggleRecurringTask(task._id)}
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
