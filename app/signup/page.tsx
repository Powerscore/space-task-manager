"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Rocket } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signUp(name, email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-space-navy p-4">
      {/* Starfield background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(white,_rgba(255,255,255,0.2)_2px,_transparent_40px)] bg-[length:50px_50px]"></div>
      </div>

      <Card className="w-full max-w-md bg-space-navy/60 backdrop-blur-md border-nebula-purple/30 card-glow">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Rocket className="h-12 w-12 text-comet-teal" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-wider text-star-white">JOIN THE MISSION</CardTitle>
          <CardDescription className="text-star-white/70">
            Create your account to start your cosmic journey
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-star-white">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Commander Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal focus:ring-comet-teal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-star-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="astronaut@space.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal focus:ring-comet-teal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-star-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-space-navy/50 border-nebula-purple/30 text-star-white focus:border-comet-teal focus:ring-comet-teal"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button"
              disabled={loading}
            >
              {loading ? "Preparing Launch..." : "Begin Mission"}
            </Button>
            <div className="text-center text-sm text-star-white/70">
              Already have an account?{" "}
              <Link href="/login" className="text-comet-teal hover:text-comet-teal/80 transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
