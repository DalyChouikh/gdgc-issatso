"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/use-auth"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, mounted, router])

  if (!mounted || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">GDG Recruitment Platform</h1>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-2xl mx-auto mb-4">
            GDG
          </div>
          <h1 className="text-4xl font-bold mb-2">GDG Recruitment Platform</h1>
          <p className="text-lg text-muted-foreground">Automated recruitment and club management system</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Streamline your recruitment process with our comprehensive platform. Manage cycles, collect applications,
            review candidates, and schedule interviews all in one place.
          </p>

          <div className="grid gap-3">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full">
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-3">Features:</p>
          <ul className="text-xs text-muted-foreground space-y-2 text-left">
            <li>✓ Dynamic form builder</li>
            <li>✓ Application management</li>
            <li>✓ Collaborative review system</li>
            <li>✓ Interview scheduling</li>
            <li>✓ Email campaigns</li>
            <li>✓ Role-based access control</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
