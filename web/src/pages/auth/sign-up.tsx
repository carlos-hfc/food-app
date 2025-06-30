import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const weekdays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
]

export function SignUp() {
  return (
    <div className="py-8">
      <Button
        asChild
        className="absolute right-8 top-8"
        variant={"ghost"}
      >
        <Link to="/sign-in">Fazer login</Link>
      </Button>

      <div className="flex flex-col justify-center gap-6 w-[400px]">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-sm text-muted-foreground">
            Seja uma pareciro e comece suas vendas!
          </p>
        </div>

        <form className="space-y-4 px-8 overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
            <Input
              id="restaurantName"
              type="text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="managerName">Seu nome</Label>
            <Input
              id="managerName"
              type="text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Seu celular</Label>
            <Input
              id="phone"
              type="email"
            />
          </div>

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

          <div className="flex flex-row gap-2">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Tempo de entrega</Label>
              <Input
                id="deliveryTime"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Taxa</Label>
              <Input
                id="tax"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select name="categoryId">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teste">Categoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Horário de funcionamento</Label>
            <div className="flex flex-wrap justify-between gap-2">
              {weekdays.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-1 relative size-10"
                  title={item}
                >
                  <Checkbox
                    value={i}
                    className="absolute size-full data-[state=checked]:bg-muted-foreground!"
                  />

                  <span className="text-muted-foreground text-lg font-medium leading-none">
                    {item.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Finalizar cadastro
          </Button>

          <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <a
              href=""
              className="underline underline-offset-4"
            >
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a
              href=""
              className="underline underline-offset-4"
            >
              Políticas de Privacidade
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
