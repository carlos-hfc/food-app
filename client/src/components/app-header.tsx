import { zodResolver } from "@hookform/resolvers/zod"
import { HamburgerIcon, SearchIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import z from "zod"

import { AccountMenu } from "./account-menu"
import { MiniCart } from "./mini-cart"
import { NavLink } from "./nav-link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const restaurantFilterSchema = z.object({
  name: z.string().optional(),
})

type RestaurantFilterSchema = z.infer<typeof restaurantFilterSchema>

export function AppHeader() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get("name")

  const { register, handleSubmit, reset } = useForm<RestaurantFilterSchema>({
    resolver: zodResolver(restaurantFilterSchema),
    defaultValues: {
      name: name ?? "",
    },
  })

  function handleFilter(data: RestaurantFilterSchema) {
    setSearchParams(prev => {
      if (data.name) {
        prev.set("name", data.name)
      } else {
        prev.delete("name")
      }

      return prev
    })
  }

  function handleClearFilter() {
    setSearchParams(prev => {
      prev.delete("name")

      return prev
    })

    reset()
  }

  return (
    <header className="container px-4 lg:px-8 max-w-6xl py-4">
      <div className="inline-flex items-center w-full gap-4">
        <HamburgerIcon className="size-8 lg:size-12 text-primary shrink-0" />

        <form
          className="max-lg:hidden w-full inline-flex items-center relative"
          onSubmit={handleSubmit(handleFilter)}
        >
          <SearchIcon
            className="size-4 text-primary absolute left-3 pointer-events-none"
            aria-label="Busque por um restaurante"
          />

          <Label
            htmlFor="name"
            className="sr-only"
          >
            Busque por um restaurante
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Busque por um restaurante"
            className="px-10"
            {...register("name")}
          />

          {name && (
            <Button
              className="absolute right-0 text-muted-foreground"
              variant="ghost"
              type="button"
              aria-label="Limpar busca"
              onClick={handleClearFilter}
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </form>

        <nav className="ml-auto inline-flex items-center gap-2">
          <NavLink to="/inicio">Início</NavLink>
          <NavLink to="/restaurantes">Restaurantes</NavLink>
          <AccountMenu />
          <MiniCart />
        </nav>
      </div>
    </header>
  )
}
