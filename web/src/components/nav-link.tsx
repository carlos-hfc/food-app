import { NavLink as Nav, NavLinkProps } from "react-router"

import { cn } from "@/lib/utils"

export function NavLink(props: NavLinkProps) {
  return (
    <Nav
      {...props}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground",
      )}
    />
  )
}
