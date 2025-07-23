import { NavLink as Nav, NavLinkProps } from "react-router"

import { cn } from "@/lib/utils"

export function NavLink(props: NavLinkProps) {
  return (
    <Nav
      {...props}
      className={cn(
        "flex items-center text-sm lg:text-base font-semibold text-muted-foreground underline-offset-8 px-2 h-8 aria-[current=page]:text-primary aria-[current=page]:underline",
        props.className,
      )}
    />
  )
}
