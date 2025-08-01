import { useQuery } from "@tanstack/react-query"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getBestRestaurants } from "@/http/get-best-restaurants"

import { CardRestaurant } from "./card-restaurant"
import { CardSkeleton } from "./card-skeleton"

export function HomePage() {
  const { data: bestRestaurants } = useQuery({
    queryKey: ["best-restaurants"],
    queryFn: getBestRestaurants,
  })

  return (
    <main className="flex flex-col relative min-h-dvh">
      <Seo title="Home" />
      <Header />

      <section className="bg-accent py-12 lg:py-16 px-4 lg:px-8">
        <div className="container max-w-2xl">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="font-bold text-2xl lg:text-4xl text-foreground">
                Tudo para facilitar seu dia a dia
              </h1>
              <p className="text-muted-foreground font-semibold">
                O que você precisa está aqui. Peça e receba onde estiver.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <Label className="sr-only">Busque um restaurante</Label>
              <Input
                className="shadow-none bg-background"
                placeholder="Busque um restaurante"
              />
              <Button className="flex-1 h-full">Buscar</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 lg:px-8 before:bg-accent before:w-full before:h-28 before:absolute before:-z-10">
        <div className="container max-w-2xl">
          <Link
            to="/restaurantes"
            className="bg-primary rounded-xl p-8 relative h-52 flex flex-col justify-center"
          >
            <p className="text-2xl text-muted font-bold">Restaurantes</p>

            <Button
              asChild
              className="bg-black/30 hover:bg-black/30 mt-auto w-max font-bold"
            >
              <span>
                Ver opções <ChevronRightIcon />
              </span>
            </Button>

            <img
              src="hamburger.webp"
              alt=""
              className="absolute right-2 bottom-0"
            />
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container max-w-6xl border-t border-border py-8 space-y-8">
          <h2 className="text-xl lg:text-3xl font-semibold">
            Os melhores restaurantes
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            {bestRestaurants ? (
              bestRestaurants?.map(restaurant => (
                <CardRestaurant
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))
            ) : (
              <CardSkeleton />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
