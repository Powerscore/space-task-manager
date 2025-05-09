"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  {
    id: "task-5",
    title: "Launch Sequence Testing",
    dueDate: "2023-06-01",
    status: "Not Started",
    progress: 0,
    priority: "High",
    attachments: 0,
  },
  {
    id: "task-6",
    title: "Communication Systems Check",
    dueDate: "2023-05-18",
    status: "In Progress",
    progress: 75,
    priority: "Medium",
    attachments: 4,
  },
]

type StatusFilter = "All" | "Completed" | "In Progress" | "Not Started"
type PriorityFilter = "All" | "High" | "Medium" | "Low"

export default function TasksPage() {
  const [tasks] = useState(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All")

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || task.status === statusFilter
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-wider text-star-white">My Tasks</h1>

        <Button asChild className="bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button">
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-star-white/50" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-space-navy/60 border-nebula-purple/30 text-star-white focus:border-comet-teal"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10">
                <Filter className="mr-2 h-4 w-4" /> Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-space-navy/90 backdrop-blur-md border-nebula-purple/30">
              <DropdownMenuLabel className="text-star-white">Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-nebula-purple/20" />
              {(["All", "Completed", "In Progress", "Not Started"] as const).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter === status}
                  onCheckedChange={() => setStatusFilter(status)}
                  className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10">
                <Filter className="mr-2 h-4 w-4" /> Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-space-navy/90 backdrop-blur-md border-nebula-purple/30">
              <DropdownMenuLabel className="text-star-white">Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-nebula-purple/20" />
              {(["All", "High", "Medium", "Low"] as const).map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={priorityFilter === priority}
                  onCheckedChange={() => setPriorityFilter(priority)}
                  className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Task grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
                      <span>{task.progress}% Complete</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-star-white/70">
            <div className="w-16 h-16 rounded-full bg-nebula-purple/10 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-nebula-purple/50" />
            </div>
            <h3 className="text-xl font-medium text-star-white mb-2">No tasks found</h3>
            <p className="text-center max-w-md">
              No tasks match your current filters. Try adjusting your search or filters, or create a new task.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 border-nebula-purple text-nebula-purple hover:bg-nebula-purple/10"
            >
              <Link href="/tasks/new">
                <Plus className="mr-2 h-4 w-4" /> Create New Task
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
