import { Outlet } from "react-router"

import { AppHeader } from "@/components/app-header"
import { Footer } from "@/components/footer"

export function AppLayout() {
  return (
    <main className="flex min-h-dvh flex-col">
      <AppHeader />

      <div className="container max-w-6xl flex flex-1 flex-col gap-4 px-4 lg:px-8 py-8">
        <Outlet />
      </div>

      <div className="max-lg:hidden">
        <Footer />
      </div>
    </main>
  )
}
