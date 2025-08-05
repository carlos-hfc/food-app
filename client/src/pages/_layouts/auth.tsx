import { HamburgerIcon } from "lucide-react"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"

export function AuthLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const logged = sessionStorage.getItem("isLogged")

    if (logged) navigate("/restaurantes", { replace: true })
  }, [navigate])

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex h-full flex-col justify-between p-10 text-muted-foreground fixed w-1/2 border-r border-foreground/5 bg-muted">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <HamburgerIcon className="size-5" />
          <span className="font-semibold">food.app</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center lg:absolute right-0 lg:w-1/2 h-full">
        <Outlet />
      </div>
    </div>
  )
}
