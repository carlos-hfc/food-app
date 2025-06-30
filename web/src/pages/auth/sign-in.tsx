import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignIn() {
  return (
    <div className="p-8">
      <Button
        asChild
        className="absolute right-8 top-8"
        variant={"ghost"}
      >
        <Link to="/sign-up">Novo estabelecimento</Link>
      </Button>

      <div className="flex flex-col justify-center gap-6 w-[320px]">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar painel
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas vendas pelo painel do parceiro
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input
              id="email"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Sua senha</Label>
            <Input
              id="password"
              type="password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Acessar painel
          </Button>
        </form>
      </div>
    </div>
  )
}
