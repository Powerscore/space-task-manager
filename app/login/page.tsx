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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(email, password)
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
          <CardTitle className="text-2xl font-bold tracking-wider text-star-white">MISSION CONTROL</CardTitle>
          <CardDescription className="text-star-white/70">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-star-white">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-comet-teal hover:text-comet-teal/80 transition-colors relative"
                >
                  Forgot Password?
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-comet-teal/0 via-comet-teal to-comet-teal/0"></span>
                </Link>
              </div>
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
              {loading ? "Initiating..." : "Launch"}
            </Button>
            <div className="text-center text-sm text-star-white/70">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-comet-teal hover:text-comet-teal/80 transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
