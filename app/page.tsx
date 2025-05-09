import Link from "next/link"
import { Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-space-navy text-star-white p-4">
      {/* Starfield background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(white,_rgba(255,255,255,0.2)_2px,_transparent_40px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center mb-6">
          <Rocket className="h-16 w-16 text-comet-teal animate-float" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-wider">COSMIC TASK MANAGER</h1>

        <p className="text-xl text-star-white/80 max-w-2xl mx-auto">
          Navigate your tasks through the vast universe of productivity with our space-themed task management system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="bg-nebula-purple hover:bg-nebula-purple/80 text-star-white glow-button">
            <Link href="/signup">Launch Mission</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-comet-teal text-comet-teal hover:bg-comet-teal/10"
          >
            <Link href="/login">Return to Base</Link>
          </Button>
        </div>
      </div>

      {/* Floating planets/elements in background */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-nebula-purple/30 to-transparent opacity-50 animate-float"></div>
      <div
        className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-comet-teal/30 to-transparent opacity-50 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-40 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-star-white/20 to-transparent opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  )
}
