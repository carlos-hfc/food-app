import {
  HamburgerIcon,
  HomeIcon,
  PizzaIcon,
  StarIcon,
  UtensilsCrossedIcon,
} from "lucide-react"

import { AccountMenu } from "./account-menu"
import { NavLink } from "./nav-link"
import { ThemeToggle } from "./theme/theme-toggle"
import { Separator } from "./ui/separator"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <HamburgerIcon className="size-6" />

        <Separator
          className="h-6"
          orientation="vertical"
        />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <HomeIcon className="size-4" />
            Inicio
          </NavLink>
          <NavLink to="/orders">
            <UtensilsCrossedIcon className="size-4" />
            Pedidos
          </NavLink>
          <NavLink to="/products">
            <PizzaIcon className="size-4" />
            Produtos
          </NavLink>
          <NavLink to="/evaluations">
            <StarIcon className="size-4" />
            Avaliações
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
