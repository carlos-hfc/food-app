import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import { HamburgerIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto container px-4 lg:px-8 max-w-6xl space-y-10 pt-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <span className="text-foreground font-bold">food.app</span>

          <ul className="*:font-medium *:text-muted-foreground flex flex-col gap-4">
            <li>teste</li>
            <li>teste</li>
            <li>teste</li>
            <li>teste</li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-foreground font-bold">food.app</span>

          <ul className="*:font-medium *:text-muted-foreground flex flex-col gap-4">
            <li>teste</li>
            <li>teste</li>
            <li>teste</li>
            <li>teste</li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-foreground font-bold">Social</span>

          <div className="*:font-medium *:text-muted-foreground flex gap-4">
            <SiFacebook className="size-8" />
            <SiX className="size-8" />
            <SiYoutube className="size-8" />
            <SiInstagram className="size-8" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 py-10 border-t border-border">
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
    </footer>
  )
}
