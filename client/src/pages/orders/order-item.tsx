import { CheckCircle2Icon, ChevronRightIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function OrderItem() {
  return (
    <div className="space-y-2">
      <time className="text-muted-foreground text-xs md:text-sm block">
        Dom 03 agosto 2025
      </time>

      <div className="rounded-md shadow-md p-3 md:px-4 divide-y space-y-3 *:pb-3">
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src="/hamburger.webp"
            alt=""
            className="rounded-full object-cover size-16 md:size-24"
          />

          <span className="text-sm md:text-base font-semibold">
            Restaurante
          </span>

          <ChevronRightIcon
            className="size-4 md:size-6 ml-auto"
            aria-label="Ver pedido"
          />
        </div>

        <div className="text-xs md:text-sm space-y-1">
          <div className="flex items-center gap-1">
            <CheckCircle2Icon className="size-4 md:size-5 fill-green-600 stroke-background" />
            <span className="text-muted-foreground">Pedido concluido</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="rounded-sm bg-accent px-1">1</span>
            <p className="text-muted-foreground">X-Salada</p>
          </div>

          <span className="font-semibold text-muted-foreground">
            mais 1 item
          </span>
        </div>

        <div className="flex text-sm justify-between">
          <span className="text-muted-foreground">Avaliação</span>

          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={cn(
                  "size-4 fill-foreground stroke-foreground",
                  i === 4 && "fill-foreground/50 stroke-foreground/40",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pb-0!">
          <Button
            variant="link"
            size="sm"
            className="text-sm! flex-1"
          >
            Detalhes
          </Button>
          <div className="h-auto w-px bg-border" />
          <Button
            variant="link"
            size="sm"
            className="text-sm! flex-1"
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>
    </div>
  )
}
