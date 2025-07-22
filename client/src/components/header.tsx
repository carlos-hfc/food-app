import { HamburgerIcon, MenuIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.addEventListener("scroll", addShadowToHeader)

    return () => document.removeEventListener("scroll", addShadowToHeader)
  }, [])

  function addShadowToHeader() {
    if (window.scrollY >= 120) return setScrolled(true)
    return setScrolled(false)
  }

  return (
    <Sheet>
      <header
        className={cn(
          "sticky top-0 w-full bg-accent z-1",
          scrolled && "shadow-xs",
        )}
      >
        <div className="flex items-center gap-4 container p-4 lg:p-8 max-w-6xl">
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
            >
              <MenuIcon
                className="size-6 text-muted-foreground"
                aria-label="Abrir menu"
              />
            </Button>
          </SheetTrigger>
          <HamburgerIcon
            className="text-primary size-10 lg:size-12"
            aria-label="food.app"
          />
          <Button
            asChild
            variant="link"
            className="max-lg:hidden ml-auto"
          >
            <Link to="/sign-up">Criar conta</Link>
          </Button>
          <Button asChild>
            <Link
              to="/sign-in"
              className="max-lg:ml-auto"
            >
              Entrar
            </Link>
          </Button>
        </div>
      </header>

      <SheetContent
        aria-describedby={undefined}
        className="sm:max-w-2xl w-full p-4 sm:p-8 lg:hidden"
      >
        <SheetHeader className="p-0 flex flex-row justify-between">
          <SheetTitle aria-label="food.app">
            <HamburgerIcon className="text-primary size-10 lg:size-12" />
          </SheetTitle>

          <SheetClose asChild>
            <Button
              size="icon"
              variant="link"
              aria-label="Fechar"
            >
              <XIcon className="size-6" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-col gap-2">
          <Button
            asChild
            size="lg"
          >
            <Link to="/sign-in">Entrar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="link"
          >
            <Link to="/sign-up">Criar conta</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
