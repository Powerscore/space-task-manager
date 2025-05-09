"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, SpaceIcon as Planet, Rocket, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function SpaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show layout on auth pages
  if (!mounted) return null

  const isAuthPage = pathname === "/login" || pathname === "/signup"

  if (isAuthPage) {
    return <div className="min-h-screen bg-space-navy">{children}</div>
  }

  return (
    <div className="min-h-screen bg-space-navy text-star-white relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(white,_rgba(255,255,255,0.2)_2px,_transparent_40px)] bg-[length:50px_50px]"></div>
      </div>

      {/* Top navigation */}
      <header className="border-b border-nebula-purple/20 bg-space-navy/80 backdrop-blur-md z-10 relative">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2 text-nebula-purple hover:text-nebula-purple/80"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Rocket className="h-6 w-6 text-comet-teal" />
                <span className="font-bold text-xl tracking-wider">COSMIC TASKS</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-nebula-purple" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-comet-teal text-[10px] text-space-navy font-bold">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-space-navy/90 backdrop-blur-md border-nebula-purple/30"
                >
                  <DropdownMenuLabel className="text-star-white">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-nebula-purple/20" />
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="py-3 px-4 focus:bg-nebula-purple/10 cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-star-white">Task deadline approaching</p>
                        <p className="text-sm text-star-white/70">"Spacecraft Design" is due in 2 hours</p>
                        <p className="text-xs text-nebula-purple">10 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-nebula-purple to-comet-teal flex items-center justify-center text-space-navy font-bold">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-space-navy/90 backdrop-blur-md border-nebula-purple/30"
                >
                  <DropdownMenuLabel className="text-star-white">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-nebula-purple/20" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer focus:bg-nebula-purple/10">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer focus:bg-nebula-purple/10">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-nebula-purple/20" />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer focus:bg-nebula-purple/10">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and main content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - animated like airlock doors */}
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-20 w-64 transform bg-space-navy/90 backdrop-blur-md border-r border-nebula-purple/20 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 md:hidden">
              <span className="font-bold">Navigation</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-nebula-purple hover:text-nebula-purple/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-1 p-4">
              {[
                { name: "Dashboard", href: "/dashboard", icon: Planet },
                { name: "My Tasks", href: "/tasks", icon: Rocket },
                { name: "Profile", href: "/profile", icon: Bell },
              ].map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-nebula-purple/20 text-comet-teal"
                        : "text-star-white hover:bg-nebula-purple/10 hover:text-comet-teal",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-comet-teal" : "text-nebula-purple")} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
