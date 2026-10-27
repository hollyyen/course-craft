"use client"

import { UserButton } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <div className="flex items-center p-4 h-16 bg-background border-b z-10 w-full justify-between">
      <div className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </div>
      <div className="flex w-full justify-end items-center gap-x-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  )
}
