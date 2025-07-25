import { BadgeCheckIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Info() {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 divide-y-1 lg:divide-y-0">
      <div className="flex items-center gap-3 pb-4">
        <img
          src="/hamburger.webp"
          alt=""
          className="rounded-full max-w-16 max-h-16 md:max-w-24 md:max-h-24 object-cover shrink-0"
        />
        <div className="relative flex items-center gap-2">
          <h1 className="font-bold text-lg md:text-2xl lg:text-3xl">
            Restaurante
          </h1>
          <BadgeCheckIcon className="size-5 md:size-6 fill-primary stroke-background" />
        </div>
        <div className="text-yellow-500 flex items-center gap-1 ml-auto">
          <StarIcon className="fill-yellow-500 stroke-yellow-500 size-3 md:size-4" />
          <span className="font-bold text-sm md:text-base">2.00</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button>Ver mais</Button>

        <div className="border px-2 py-1.5 text-xs">
          <p className="font-semibold">Hoje</p>
          <p className="text-muted-foreground">
            40-50 min - <span>Grátis</span>
          </p>
        </div>
      </div>
    </div>
  )
}
