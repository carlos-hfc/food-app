import { BadgeCheckIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { GetRestarauntInfoResponse } from "@/http/get-restaurant-info"
import { formatPriceNumber } from "@/lib/format-price-number"

import { RestaurantSeeMore } from "./restaurant-see-more"

type InfoProps = GetRestarauntInfoResponse

export function Info({
  restaurant,
  rateResume,
  evaluationByRate,
  rates,
}: InfoProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 divide-y lg:divide-y-0">
      <div className="flex items-center gap-3 pb-4 lg:pb-0">
        <img
          src={restaurant.image ?? "/hamburger.webp"}
          alt={restaurant.name}
          className="rounded-full size-12 md:size-24 object-cover shrink-0"
        />

        <div className="relative flex items-center gap-2">
          <h1 className="font-bold text-lg md:text-2xl lg:text-3xl">
            {restaurant.name}
          </h1>
          <BadgeCheckIcon className="size-5 md:size-6 fill-primary stroke-background shrink-0" />
        </div>

        <div className="text-yellow-500 flex items-center gap-1 ml-auto">
          <StarIcon className="fill-yellow-500 stroke-yellow-500 size-3 md:size-4" />
          <span className="font-bold text-sm md:text-base">
            {rateResume.average > 0
              ? rateResume.average.toFixed(2)
              : "Novidade"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button>Ver mais</Button>
          </SheetTrigger>

          <RestaurantSeeMore
            hours={restaurant.hours}
            rateResume={rateResume}
            evaluationByRate={evaluationByRate}
            rates={rates}
          />
        </Sheet>

        <div className="border px-2 py-1.5 text-xs">
          <p className="font-semibold">
            {restaurant.hours.find(item => item.weekday === new Date().getDay())
              ?.open && "Hoje"}
          </p>
          <p className="text-muted-foreground">
            {restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min -{" "}
            {restaurant.tax === 0
              ? "Grátis"
              : formatPriceNumber(restaurant.tax)}
          </p>
        </div>
      </div>
    </div>
  )
}
