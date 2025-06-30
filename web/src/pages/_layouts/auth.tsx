import { HamburgerIcon } from "lucide-react"
import { Outlet } from "react-router"

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground fixed w-1/2 left-0">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <HamburgerIcon className="size-5" />
          <span className="font-semibold">food.app</span>
        </div>

        <footer className="text-sm">
          Painel do parceiro &copy; food.app - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center absolute right-0 w-1/2 h-full">
        <Outlet />
      </div>
    </div>
  )
}
