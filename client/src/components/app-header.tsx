import { zodResolver } from "@hookform/resolvers/zod"
import { HamburgerIcon, SearchIcon, XIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router"
import z from "zod"

import { AccountMenu } from "./account-menu"
import { MiniCart } from "./mini-cart"
import { NavLink } from "./nav-link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const restaurantFilterSchema = z.object({
  restaurantName: z.string().optional(),
})

type RestaurantFilterSchema = z.infer<typeof restaurantFilterSchema>

export function AppHeader() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const restaurantName = searchParams.get("q")

  const { register, handleSubmit, reset, watch } =
    useForm<RestaurantFilterSchema>({
      resolver: zodResolver(restaurantFilterSchema),
      defaultValues: {
        restaurantName: restaurantName ?? "",
      },
    })

  useEffect(() => {
    if (!restaurantName) {
      reset()
    }
  }, [reset, restaurantName])

  function handleFilter(data: RestaurantFilterSchema) {
    navigate(`/busca?q=${data.restaurantName}`)
  }

  return (
    <header className="py-4 border-b sticky top-0 bg-background shadow-sm z-2">
      <div className="flex items-center gap-4 container max-w-6xl px-4 lg:px-8">
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
            htmlFor="restaurantName"
            className="sr-only"
          >
            Busque por um restaurante
          </Label>
          <Input
            id="restaurantName"
            type="text"
            placeholder="Busque por um restaurante"
            className="px-10"
            {...register("restaurantName")}
          />

          {(restaurantName || watch("restaurantName")) && (
            <Button
              className="absolute right-0 text-muted-foreground"
              variant="ghost"
              type="button"
              aria-label="Limpar busca"
              onClick={() => reset()}
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </form>

        <nav className="ml-auto inline-flex items-center md:gap-2">
          <NavLink to="/restaurantes">Restaurantes</NavLink>
          <AccountMenu />
          <MiniCart />
        </nav>
      </div>
    </header>
  )
}
