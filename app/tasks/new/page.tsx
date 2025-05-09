"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Rocket, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function NewTaskPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !date) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Task created",
        description: "Your new task has been successfully created.",
      })

      router.push("/tasks")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create task",
        description: "There was an error creating your task. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="text-star-white hover:bg-nebula-purple/10 -ml-2">
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
          </Link>
        </Button>
      </div>

      <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
        <CardHeader>
          <CardTitle className="text-2xl text-star-white">Create New Task</CardTitle>
          <CardDescription className="text-star-white/70">Add a new task to your mission control</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-star-white">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-star-white">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal resize-none min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-star-white">
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-nebula-purple/30 bg-space-navy/50 text-star-white hover:bg-nebula-purple/10",
                        !date && "text-star-white/50",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4 text-nebula-purple" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-space-navy border-nebula-purple/30">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="bg-space-navy text-star-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-star-white">
                  Status
                </Label>
                <Select defaultValue={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger
                    id="status"
                    className="border-nebula-purple/30 bg-space-navy/50 text-star-white focus:border-comet-teal"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-space-navy border-nebula-purple/30">
                    <SelectItem
                      value="Not Started"
                      className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                    >
                      Not Started
                    </SelectItem>
                    <SelectItem
                      value="In Progress"
                      className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                    >
                      In Progress
                    </SelectItem>
                    <SelectItem
                      value="Completed"
                      className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                    >
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-star-white">
                  Priority
                </Label>
                <Select
                  defaultValue={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger
                    id="priority"
                    className="border-nebula-purple/30 bg-space-navy/50 text-star-white focus:border-comet-teal"
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-space-navy border-nebula-purple/30">
                    <SelectItem value="Low" className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white">
                      Low
                    </SelectItem>
                    <SelectItem
                      value="Medium"
                      className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="High"
                      className="text-star-white focus:bg-nebula-purple/10 focus:text-star-white"
                    >
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-star-white">Attachments</Label>
                <div className="border border-dashed border-nebula-purple/30 rounded-md p-6 text-center hover:bg-nebula-purple/5 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-nebula-purple/70" />
                  <p className="text-sm text-star-white/70">Drag & drop files here or click to browse</p>
                  <p className="text-xs text-star-white/50 mt-1">Max file size: 10MB</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10"
            >
              <Link href="/tasks">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" /> Create Task
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
