"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/register") || pathname?.startsWith("/login")

  return (
    <div 
      className="relative flex min-h-screen flex-col bg-background"
      role="document"
      aria-label="FeedForward applikasjon"
    >
      {!isAuthPage && <Navbar />}
      <main 
        className="flex-1"
        role="main"
        aria-label={isAuthPage ? "Autentiseringsside" : "Hovedinnhold"}
      >
        {children}
      </main>
    </div>
  )
} 