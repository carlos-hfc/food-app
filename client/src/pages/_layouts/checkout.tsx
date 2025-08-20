import { HamburgerIcon } from "lucide-react"
import { Outlet, ScrollRestoration } from "react-router"

import { AccountMenu } from "@/components/account-menu"

export function CheckoutLayout() {
  return (
    <main className="flex h-dvh flex-col">
      <header className="py-3 border-b bg-background shadow-sm z-2">
        <div className="flex items-center justify-between gap-4 container max-w-6xl px-4 lg:px-8">
          <HamburgerIcon className="size-8 lg:size-10 text-primary shrink-0" />

          <AccountMenu />
        </div>
      </header>

      <ScrollRestoration />

      <div className="overflow-y-auto flex-1 flex">
        <div className="container max-w-3xl flex px-4 lg:px-8 my-8">
          <Outlet />
        </div>
      </div>

      <footer className="border-t">
        <div className="mt-auto container px-4 lg:px-8 max-w-6xl space-y-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 py-6">
            <div className="flex gap-3 lg:gap-6 items-center">
              <HamburgerIcon
                className="text-primary size-10 lg:size-12"
                aria-label="food.app"
              />
              <p className="text-xs lg:text-sm text-muted-foreground">
                &copy; Copyright {new Date().getFullYear()} - food.app <br />
                Todos os direitos reservados food.app
              </p>
            </div>

            <ul className="*:font-medium *:text-muted-foreground flex flex-col md:flex-row justify-between gap-4 lg:gap-8">
              <li>Termos e condições</li>
              <li>Código de conduta</li>
              <li>Privacidade</li>
              <li>Dicas de segurança</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
