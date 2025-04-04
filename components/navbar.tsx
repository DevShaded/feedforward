"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = () => (
    <>
      {status === "loading" ? (
        <div className="flex items-center" role="status" aria-label="Laster innhold">
          <Icons.spinner className="h-4 w-4 animate-spin" aria-hidden="true" />
        </div>
      ) : session ? (
        <>
          <Link href="/features">
            <Button
              variant={pathname === "/features" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
              aria-current={pathname === "/features" ? "page" : undefined}
            >
              <Icons.sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              Funksjoner
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
              aria-current={pathname === "/dashboard" ? "page" : undefined}
            >
              <Icons.layoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" />
              Dashbord
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setIsOpen(false)
              signOut()
            }}
            aria-label="Logg ut"
          >
            <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
            Logg ut
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button
              variant={pathname === "/login" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
              aria-current={pathname === "/login" ? "page" : undefined}
            >
              <Icons.logIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Logg inn
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant={pathname === "/register" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
              aria-current={pathname === "/register" ? "page" : undefined}
            >
              <Icons.userPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Registrer deg
            </Button>
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="max-w-7xl mx-auto sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-gray-800">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.sparkles className="h-6 w-6" />
            <span className="font-bold">Feature Request App</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 items-center justify-between space-x-2 md:justify-end hidden md:flex">
          <div className="flex items-center space-x-4">
            <NavItems />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-4">
                <NavItems />
                <div className="pt-4">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 