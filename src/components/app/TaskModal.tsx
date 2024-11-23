'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Clock, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from "@/types"
import { translateToFrench } from '@/utils/function'

interface TaskUpdateModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onStatusChange: (taskId: string, newStatus: 'complet') => void
}

export default function TaskUpdateModal({ task, isOpen, onClose, onStatusChange }: TaskUpdateModalProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      onStatusChange(task._id, 'complet')
      setIsCompleting(false)
      onClose()
    }, 1000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "haute":
        return "text-[#FF0000] dark:text-[#FF6B6B]"
      case "moyenne":
        return "text-[#FFA500] dark:text-[#FFD700]"
      case "basse":
        return "text-[#008000] dark:text-[#90EE90]"
      default:
        return "text-[#272B3B] dark:text-[#A8DCE7]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "non démarré":
        return <Clock className="h-4 w-4 text-[#272B3B] dark:text-[#A8DCE7]" />
      case "en cours":
        return <Calendar className="h-4 w-4 text-[#A8DCE7] dark:text-[#FFFFFF]" />
      case "complet":
        return <CheckCircle className="h-4 w-4 text-[#008000] dark:text-[#90EE90]" />
      default:
        return <AlertTriangle className="h-4 w-4 text-[#FFA500] dark:text-[#FFD700]" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#101422]/70 dark:bg-[#000000]/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md mx-4"
          >
            <Card className="bg-[#FFFFFF] dark:bg-[#272B3B] border border-[#A8DCE7]/20 shadow-lg">
              <CardHeader className="relative border-b border-[#A8DCE7]/20 dark:border-[#101422]/20">
                <CardTitle className="text-[#101422] dark:text-[#A8DCE7] text-xl font-semibold">
                  {task.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-[#101422] dark:text-[#A8DCE7] hover:text-[#A8DCE7] dark:hover:text-[#FFFFFF] transition-colors duration-200"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-[#272B3B] dark:text-[#FFFFFF] mb-4">{task.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium text-[#101422] dark:text-[#A8DCE7]">Priority:</span>
                    <span className={`${getPriorityColor(task.priority)}`}>{translateToFrench(task.priority)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <span className="font-medium text-[#101422] dark:text-[#A8DCE7]">Status:</span>
                    <span className="text-[#272B3B] dark:text-[#FFFFFF]">{translateToFrench(task.status)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-[#272B3B] dark:text-[#A8DCE7]" />
                    <span className="font-medium text-[#101422] dark:text-[#A8DCE7]">Estimated Time:</span>
                    <span className="text-[#272B3B] dark:text-[#FFFFFF]">{task.estimatedTime} minutes</span>
                  </div>
                  {task.startTime && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#272B3B] dark:text-[#A8DCE7]" />
                      <span className="font-medium text-[#101422] dark:text-[#A8DCE7]">Start Time:</span>
                      <span className="text-[#272B3B] dark:text-[#FFFFFF]">
                        {new Date(task.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {task.endTime && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#272B3B] dark:text-[#A8DCE7]" />
                      <span className="font-medium text-[#101422] dark:text-[#A8DCE7]">End Time:</span>
                      <span className="text-[#272B3B] dark:text-[#FFFFFF]">
                        {new Date(task.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-[#A8DCE7]/20 dark:border-[#101422]/20 pt-4">
                <Button
                  onClick={handleComplete}
                  disabled={task.status === 'complet' || isCompleting}
                  className="bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-[#A8DCE7] dark:bg-[#101422] dark:text-[#A8DCE7] dark:hover:bg-[#A8DCE7] dark:hover:text-[#101422] transition-colors duration-200"
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
                  Mark as Complete
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}