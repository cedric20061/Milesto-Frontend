import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"
import { Calendar, Target, Trophy, TrendingUp } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { RootState } from "@/app/store"
import { fetchGoals } from "@/features/goals/goalsSlice"
import { fetchSchedules } from "@/features/dailySchedule/dailyScheduleSlice"

const COLORS = ["#A8DCE7", "#272B3B", "#BBBBBA", "#101422", "#8884d8"]

export default function StatisticsPage() {
  const dispatch = useAppDispatch()
  const { goals, status: goalsLoading } = useAppSelector((state: RootState) => state.goals)
  const { schedules, status: schedulesLoading } = useAppSelector((state: RootState) => state.dailySchedule)

  useEffect(() => {
    dispatch(fetchGoals())
    dispatch(fetchSchedules())
  }, [dispatch])

  const loading = goalsLoading=="loading" || schedulesLoading=="loading"

  const progressData = goals.reduce((acc, goal) => {
    const month = new Date(goal.targetDate).toLocaleString('default', { month: 'short' })
    const completed = goal.status === "complet" ? 1 : 0
    const inProgress = goal.status === "en cours" ? 1 : 0

    const existing = acc.find((item) => item.month === month)
    if (existing) {
      existing.completed += completed
      existing.inProgress += inProgress
    } else {
      acc.push({ month, completed, inProgress })
    }

    return acc
  }, [] as { month: string; completed: number; inProgress: number }[])

  const categoryData = goals.reduce((acc, goal) => {
    const existing = acc.find((item) => item.name === goal.category)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: goal.category, value: 1 })
    }
    return acc
  }, [] as { name: string; value: number }[])

  const consistencyData = schedules.reduce((acc, schedule) => {
    const day = new Date(schedule.date).toLocaleString('default', { weekday: 'short' })
    const completedTasks = schedule.tasks.filter((task) => task.status === "complet").length
    const totalTasks = schedule.tasks.length
    const score = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const existing = acc.find((item) => item.day === day)
    if (existing) {
      existing.score = (existing.score + score) / 2
    } else {
      acc.push({ day, score })
    }

    return acc
  }, [] as { day: string; score: number }[])

  const milestoneProgress = goals
    .flatMap((goal) => goal.milestones)
    .reduce(
      (acc, milestone) => {
        acc.total += 1
        acc.completed += milestone.completed ? 1 : 0
        return acc
      },
      { completed: 0, total: 0 }
    )

  const milestoneCompletionRate =
    milestoneProgress.total > 0
      ? Math.round((milestoneProgress.completed / milestoneProgress.total) * 100)
      : 0

  const observations = {
    progress:
      progressData.length > 0
        ? `The month with the highest number of completed goals is ${
            progressData.reduce((best, current) =>
              current.completed > best.completed ? current : best
            ).month
          }.`
        : "You haven't set any goals for the current months.",
    category:
      categoryData.length > 0
        ? `The most popular category is "${
            categoryData.reduce((best, current) =>
              current.value > best.value ? current : best
            ).name
          }".`
        : "No categories defined for your goals.",
    consistency:
      consistencyData.length > 0
        ? `The most productive days are ${
            consistencyData.reduce((best, current) =>
              current.score > best.score ? current : best
            ).day
          } with an average rate of ${Math.round(
            consistencyData.reduce((acc, d) => acc + d.score, 0) /
              consistencyData.length
          )}%.`
        : "No task data available to assess your consistency.",
    milestone:
      milestoneProgress.total > 0
        ? `You've completed ${milestoneProgress.completed} milestones out of ${milestoneProgress.total} (${milestoneCompletionRate}%).`
        : "No milestones are defined or completed.",
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <>
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#101422] dark:text-[#A8DCE7]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Statistics
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2" />
                Monthly Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#A8DCE7" name="Completed" />
                    <Bar dataKey="inProgress" fill="#272B3B" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-[300px]"
                  {...fadeInUp}
                >
                  <Target className="w-16 h-16 text-[#A8DCE7] mb-4" />
                  <p className="text-center">No goal data available. Start setting some goals!</p>
                </motion.div>
              )}
              <p className="mt-4 text-sm">{observations.progress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pie className="mr-2" dataKey={""} />
                Goal Distribution by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-[300px]"
                  {...fadeInUp}
                >
                  <Target className="w-16 h-16 text-[#A8DCE7] mb-4" />
                  <p className="text-center">No categories defined. Try adding some categories to your goals!</p>
                </motion.div>
              )}
              <p className="mt-4 text-sm">{observations.category}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" />
                Daily Task Consistency
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : consistencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consistencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#A8DCE7" name="Consistency Score (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-[300px]"
                  {...fadeInUp}
                >
                  <Calendar className="w-16 h-16 text-[#A8DCE7] mb-4" />
                  <p className="text-center">No task data available. Start planning your days!</p>
                </motion.div>
              )}
              <p className="mt-4 text-sm">{observations.consistency}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : (
                <motion.div 
                  className="space-y-4"
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                >
                  <motion.p variants={fadeInUp}>
                    Total Goals: <span className="font-bold">{goals.length || "None"}</span>
                  </motion.p>
                  <motion.p variants={fadeInUp}>{observations.milestone}</motion.p>
                  <motion.div 
                    className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
                    variants={fadeInUp}
                  >
                    <div 
                      className="bg-[#A8DCE7] h-2.5 rounded-full" 
                      style={{ width: `${milestoneCompletionRate}%` }}
                    ></div>
                  </motion.div>
                  <motion.p variants={fadeInUp} className="text-sm text-right">
                    {milestoneCompletionRate}% Complete
                  </motion.p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
  )
}