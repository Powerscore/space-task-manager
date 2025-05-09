"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Plus, Rocket } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Mock data
const mockTasks = [
  {
    id: "task-1",
    title: "Spacecraft Design",
    dueDate: "2023-05-15",
    status: "In Progress",
    progress: 45,
    priority: "High",
    attachments: 3,
  },
  {
    id: "task-2",
    title: "Mission Planning",
    dueDate: "2023-05-20",
    status: "Not Started",
    progress: 0,
    priority: "Medium",
    attachments: 1,
  },
  {
    id: "task-3",
    title: "Crew Selection",
    dueDate: "2023-05-10",
    status: "Completed",
    progress: 100,
    priority: "High",
    attachments: 5,
  },
  {
    id: "task-4",
    title: "Resource Allocation",
    dueDate: "2023-05-25",
    status: "In Progress",
    progress: 30,
    priority: "Low",
    attachments: 2,
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks] = useState(mockTasks)

  // Get counts for dashboard stats
  const completedTasks = tasks.filter((task) => task.status === "Completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length
  const notStartedTasks = tasks.filter((task) => task.status === "Not Started").length

  // Calculate overall progress
  const overallProgress =
    tasks.length > 0 ? Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-star-white">Mission Control</h1>
          <p className="text-star-white/70">Welcome back, {user?.name || "Commander"}</p>
        </div>

        <Button asChild className="bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button">
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-star-white/70">Total Tasks</CardDescription>
            <CardTitle className="text-3xl text-star-white">{tasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2 bg-nebula-purple/20" indicatorClassName="bg-comet-teal" />
            <p className="text-xs mt-2 text-star-white/70">{overallProgress}% Overall Completion</p>
          </CardContent>
        </Card>

        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-star-white/70">Completed</CardDescription>
            <CardTitle className="text-3xl text-comet-teal">{completedTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(completedTasks / tasks.length) * 100}
              className="h-2 bg-nebula-purple/20"
              indicatorClassName="bg-comet-teal"
            />
            <p className="text-xs mt-2 text-star-white/70">
              {Math.round((completedTasks / tasks.length) * 100)}% of Total Tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-star-white/70">In Progress</CardDescription>
            <CardTitle className="text-3xl text-nebula-purple">{inProgressTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(inProgressTasks / tasks.length) * 100}
              className="h-2 bg-nebula-purple/20"
              indicatorClassName="bg-nebula-purple"
            />
            <p className="text-xs mt-2 text-star-white/70">
              {Math.round((inProgressTasks / tasks.length) * 100)}% of Total Tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-star-white/70">Not Started</CardDescription>
            <CardTitle className="text-3xl text-star-white/80">{notStartedTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(notStartedTasks / tasks.length) * 100}
              className="h-2 bg-nebula-purple/20"
              indicatorClassName="bg-star-white/50"
            />
            <p className="text-xs mt-2 text-star-white/70">
              {Math.round((notStartedTasks / tasks.length) * 100)}% of Total Tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task cards */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-star-white">Recent Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30 h-full transition-all duration-300 hover:translate-y-[-4px] card-glow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-star-white">{task.title}</CardTitle>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-comet-teal/20 text-comet-teal"
                          : task.status === "In Progress"
                            ? "bg-nebula-purple/20 text-nebula-purple"
                            : "bg-star-white/10 text-star-white/80"
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <Progress
                    value={task.progress}
                    className="h-1 mb-4 bg-nebula-purple/20"
                    indicatorClassName={`${
                      task.status === "Completed"
                        ? "bg-comet-teal"
                        : task.status === "In Progress"
                          ? "bg-nebula-purple"
                          : "bg-star-white/50"
                    }`}
                  />
                  <div className="flex items-center text-star-white/70 text-sm">
                    <Clock className="h-4 w-4 mr-1 text-nebula-purple" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex justify-between items-center w-full text-xs text-star-white/70">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          task.priority === "High"
                            ? "bg-red-500"
                            : task.priority === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      {task.priority} Priority
                    </div>
                    <div className="flex items-center">
                      <Rocket className="h-3 w-3 mr-1 text-comet-teal" />
                      {task.attachments} files
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Calendar section */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-star-white">Upcoming Deadlines</h2>
        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader>
            <CardTitle className="text-star-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-comet-teal" />
              May 2023
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((task) => (
                  <div key={task.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-nebula-purple/20 flex items-center justify-center">
                      <span className="text-nebula-purple font-bold">{new Date(task.dueDate).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-star-white truncate">{task.title}</p>
                      <p className="text-xs text-star-white/70">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-comet-teal/20 text-comet-teal"
                          : task.status === "In Progress"
                            ? "bg-nebula-purple/20 text-nebula-purple"
                            : "bg-star-white/10 text-star-white/80"
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
