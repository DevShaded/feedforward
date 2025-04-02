"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/register") || pathname?.startsWith("/login")

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  )
} 