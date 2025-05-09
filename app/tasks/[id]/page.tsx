"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Edit, FileText, MessageSquare, Paperclip, Rocket, Trash2, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data
const mockTask = {
  id: "task-1",
  title: "Spacecraft Design",
  description:
    "Create detailed designs for the spacecraft, including propulsion systems, life support, and navigation. Ensure all designs meet safety standards and mission requirements.",
  dueDate: "2023-05-15",
  status: "In Progress",
  progress: 45,
  priority: "High",
  attachments: [
    { id: "att-1", name: "design-specs.pdf", size: "2.4 MB", type: "pdf" },
    { id: "att-2", name: "propulsion-calculations.xlsx", size: "1.1 MB", type: "xlsx" },
    { id: "att-3", name: "navigation-systems.docx", size: "890 KB", type: "docx" },
  ],
  activities: [
    { id: "act-1", user: "Commander Smith", action: "created this task", timestamp: "2023-05-01T10:30:00Z" },
    { id: "act-2", user: "Engineer Johnson", action: "uploaded design-specs.pdf", timestamp: "2023-05-02T14:15:00Z" },
    { id: "act-3", user: "Commander Smith", action: "updated the task description", timestamp: "2023-05-03T09:45:00Z" },
    {
      id: "act-4",
      user: "Engineer Johnson",
      action: "changed status to In Progress",
      timestamp: "2023-05-04T11:20:00Z",
    },
  ],
  assignees: [
    { id: "user-1", name: "Commander Smith" },
    { id: "user-2", name: "Engineer Johnson" },
  ],
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [task] = useState(mockTask)
  const [comment, setComment] = useState("")

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format timestamp for activity log
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleDelete = () => {
    // Mock delete functionality
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted.",
    })
    router.push("/tasks")
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    toast({
      title: "Comment added",
      description: "Your comment has been added to the activity log.",
    })
    setComment("")
  }

  return (
    <div className="space-y-6">
      {/* Back button and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="ghost" asChild className="text-star-white hover:bg-nebula-purple/10 -ml-2">
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="border-nebula-purple text-nebula-purple hover:bg-nebula-purple/10"
          >
            <Link href={`/tasks/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-500/80 hover:bg-red-500 text-white">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-space-navy border-nebula-purple/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-star-white">Delete Task</AlertDialogTitle>
                <AlertDialogDescription className="text-star-white/70">
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500/80 hover:bg-red-500 text-white">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Task header */}
      <div className="bg-space-navy/60 backdrop-blur-md border border-nebula-purple/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-star-white mb-2">{task.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-star-white/70">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-nebula-purple" />
                Due: {formatDate(task.dueDate)}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-nebula-purple" />
                Assignees: {task.assignees.map((a) => a.name).join(", ")}
              </div>
              <div className="flex items-center">
                <Paperclip className="h-4 w-4 mr-1 text-nebula-purple" />
                {task.attachments.length} attachments
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.status === "Completed"
                  ? "bg-comet-teal/20 text-comet-teal"
                  : task.status === "In Progress"
                    ? "bg-nebula-purple/20 text-nebula-purple"
                    : "bg-star-white/10 text-star-white/80"
              }`}
            >
              {task.status}
            </div>
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
              <span className="text-sm text-star-white/70">{task.priority} Priority</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-star-white/70">Progress: {task.progress}%</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10"
                >
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-space-navy/90 backdrop-blur-md border-nebula-purple/30">
                {["Not Started", "In Progress", "Completed"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Progress
            value={task.progress}
            className="h-2 bg-nebula-purple/20"
            indicatorClassName={`${
              task.status === "Completed"
                ? "bg-comet-teal"
                : task.status === "In Progress"
                  ? "bg-nebula-purple"
                  : "bg-star-white/50"
            }`}
          />
        </div>
      </div>

      {/* Task content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <Card className="lg:col-span-2 bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader>
            <CardTitle className="text-star-white flex items-center">
              <FileText className="h-5 w-5 mr-2 text-comet-teal" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-star-white/90 whitespace-pre-line">{task.description}</p>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-star-white flex items-center">
              <Paperclip className="h-5 w-5 mr-2 text-comet-teal" />
              Attachments
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10"
            >
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-2 rounded-md hover:bg-nebula-purple/10 transition-colors"
                >
                  <div className="h-10 w-10 rounded-md bg-nebula-purple/20 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-nebula-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-star-white truncate">{attachment.name}</p>
                    <p className="text-xs text-star-white/70">{attachment.size}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-star-white/70 hover:text-star-white hover:bg-nebula-purple/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {task.attachments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-nebula-purple/10 flex items-center justify-center mb-3">
                    <Paperclip className="h-6 w-6 text-nebula-purple/50" />
                  </div>
                  <p className="text-sm text-star-white/70 mb-2">No attachments yet</p>
                  <p className="text-xs text-star-white/50 max-w-[200px]">
                    Upload files by clicking the Upload button above
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity log */}
        <Card className="lg:col-span-3 bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader>
            <CardTitle className="text-star-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-comet-teal" />
              Activity Log
            </CardTitle>
            <CardDescription className="text-star-white/70">
              Track all updates and comments on this task
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Comment form */}
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal resize-none min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button"
                    disabled={!comment.trim()}
                  >
                    <Rocket className="mr-2 h-4 w-4" /> Send
                  </Button>
                </div>
              </form>

              <Separator className="bg-nebula-purple/20" />

              {/* Activity items */}
              <div className="space-y-4">
                {task.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-nebula-purple to-comet-teal flex items-center justify-center text-space-navy font-bold">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="font-medium text-star-white">{activity.user}</span>
                        <span className="text-star-white/70">{activity.action}</span>
                        <span className="text-xs text-star-white/50">{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Missing component definition
function Download(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
