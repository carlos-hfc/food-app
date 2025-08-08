import { format } from "date-fns"
import { ClockIcon, StarIcon, XIcon } from "lucide-react"

import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { weekdays } from "@/constants"
import { cn } from "@/lib/utils"

interface RestaurantSeeMoreProps {
  hours: {
    hourId: string
    weekday: number
    openedAt: string
    closedAt: string
    open: boolean
  }[]
  rates: {
    id: string
    client: string
    rate: number
    comment: string | null
    createdAt: string
  }[]
  rateResume: {
    totalCount: number
    average: number
  }
  evaluationByRate: {
    count: number
    rate: number
  }[]
}

export function RestaurantSeeMore({
  hours,
  rateResume,
  rates,
  evaluationByRate,
}: RestaurantSeeMoreProps) {
  return (
    <SheetContent className="p-4 lg:p-8 w-full gap-0">
      <SheetClose className="lg:absolute top-4 left-4">
        <XIcon className="text-primary" />
      </SheetClose>

      <SheetHeader hidden>
        <SheetTitle>Informações da loja</SheetTitle>
        <SheetDescription>Informações da loja</SheetDescription>
      </SheetHeader>

      <Tabs
        defaultValue="hours"
        className="gap-4"
      >
        <TabsList>
          <TabsTrigger value="hours">Horário</TabsTrigger>
          {rates.length > 0 && (
            <TabsTrigger value="evaluations">Avaliação</TabsTrigger>
          )}
        </TabsList>

        <TabsContent
          value="hours"
          className="space-y-3"
        >
          {hours?.map((hour, i) => (
            <div
              key={hour.hourId}
              className={cn(
                "grid grid-cols-2 text-sm lg:text-base text-muted-foreground",
                hour.weekday === new Date().getDay() &&
                  "font-bold text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                {hour.weekday === new Date().getDay() && (
                  <ClockIcon className="shrink-0 size-3.5 text-primary" />
                )}
                {weekdays[i]}
              </div>
              <div>
                {hour.open ? `${hour.openedAt} às ${hour.closedAt}` : "Fechado"}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent
          value="evaluations"
          className="space-y-4"
        >
          <div className="flex items-stretch justify-center gap-3 border rounded-md px-3">
            <div className="self-center py-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">
                  {rateResume.average.toLocaleString("pt-BR", {
                    style: "decimal",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </span>

                <StarIcon className="fill-yellow-500 stroke-yellow-500 size-5" />
              </div>

              <p className="text-muted-foreground text-center text-xs">
                {rateResume.totalCount} avaliações
              </p>
            </div>

            <div className="flex-1 border-l pl-3 py-2">
              {evaluationByRate?.map(rate => (
                <div
                  key={rate.rate}
                  className="flex items-center gap-2 text-xs"
                >
                  <p>{rate.rate}</p>
                  <StarIcon className="size-2.5 shrink-0 fill-foreground" />
                  <div className="w-full h-1 bg-muted-foreground/50 rounded-lg relative">
                    <div
                      className="bg-foreground absolute h-full rounded-lg"
                      style={{
                        width: `${(rate.count * 100) / rateResume.totalCount}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y-1 overflow-y-auto h-[calc(100vh_-_14rem)] lg:h-[calc(100vh_-_16rem)]">
            {rates?.map(rate => (
              <div
                key={rate.id}
                className="py-4 space-y-1"
              >
                <p className="font-bold lg:text-lg">{rate.client}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold leading-none">
                      {rate.rate.toLocaleString("pt-BR", {
                        style: "decimal",
                        maximumFractionDigits: 1,
                        minimumFractionDigits: 1,
                      })}
                    </span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 })?.map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "size-4",
                            rate.rate >= i + 1
                              ? "fill-yellow-500 stroke-yellow-500"
                              : "fill-border stroke-border",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <time
                    dateTime={rate.createdAt}
                    title={format(new Date(rate.createdAt), "dd/MM/yyyy")}
                    className="text-muted-foreground"
                  >
                    {format(new Date(rate.createdAt), "dd/MM/yyyy")}
                  </time>
                </div>

                {rate.comment && (
                  <p className="text-sm text-muted-foreground">
                    {rate.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </SheetContent>
  )
}
