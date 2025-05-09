"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Save } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Astronaut and space explorer with a passion for discovering new frontiers.",
    location: "Space Station Alpha",
    website: "https://cosmic-explorer.space",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-wider text-star-white">Profile</h1>
        <p className="text-star-white/70">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <Card className="bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader>
            <CardTitle className="text-star-white">Profile Picture</CardTitle>
            <CardDescription className="text-star-white/70">
              Upload your avatar to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-nebula-purple to-comet-teal flex items-center justify-center text-space-navy text-4xl font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <button className="absolute bottom-0 right-0 bg-nebula-purple text-star-white p-2 rounded-full hover:bg-nebula-purple/80 transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <Button
              variant="outline"
              className="w-full border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10"
            >
              Upload New Image
            </Button>
          </CardContent>
        </Card>

        {/* Profile info card */}
        <Card className="lg:col-span-2 bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader>
            <CardTitle className="text-star-white">Personal Information</CardTitle>
            <CardDescription className="text-star-white/70">
              Update your personal details and public profile
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-star-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-star-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-star-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal resize-none min-h-[100px]"
                />
              </div>

              <Separator className="bg-nebula-purple/20" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-star-white">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-star-white">
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="ml-auto bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Account settings card */}
        <Card className="lg:col-span-3 bg-space-navy/60 backdrop-blur-md border-nebula-purple/30">
          <CardHeader>
            <CardTitle className="text-star-white">Account Settings</CardTitle>
            <CardDescription className="text-star-white/70">
              Manage your account preferences and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-star-white">Email Notifications</h3>
                    <p className="text-sm text-star-white/70">Receive email updates about your tasks</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-nebula-purple/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    <span className="inline-block h-5 w-5 translate-x-5 transform rounded-full bg-comet-teal transition-transform"></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-star-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-star-white/70">Add an extra layer of security to your account</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-nebula-purple/30 text-star-white hover:bg-nebula-purple/10"
                  >
                    Enable
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-star-white">Dark Theme</h3>
                    <p className="text-sm text-star-white/70">Always use dark space theme</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-nebula-purple/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    <span className="inline-block h-5 w-5 translate-x-5 transform rounded-full bg-comet-teal transition-transform"></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-star-white">Account Deletion</h3>
                    <p className="text-sm text-star-white/70">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" className="bg-red-500/80 hover:bg-red-500 text-white">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
