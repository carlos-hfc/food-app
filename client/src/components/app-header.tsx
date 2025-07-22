import { HamburgerIcon } from "lucide-react"

import { AccountMenu } from "./account-menu"
import { NavLink } from "./nav-link"

export function AppHeader() {
  return (
    <header className="container px-4 lg:px-8 max-w-6xl py-4">
      <div className="inline-flex items-center w-full gap-2">
        <HamburgerIcon className="size-8 lg:size-12 text-primary" />

        <nav className="ml-auto inline-flex gap-2">
          <NavLink to="/inicio">Início</NavLink>
          <NavLink to="/restaurantes">Restaurantes</NavLink>
          <AccountMenu />
        </nav>
      </div>
    </header>
  )
}
