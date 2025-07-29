import { useQuery } from "@tanstack/react-query"
import { StoreIcon } from "lucide-react"
import { useParams } from "react-router"

import { Seo } from "@/components/seo"
import { Skeleton } from "@/components/ui/skeleton"
import { getMenu } from "@/http/get-menu"
import { getRestarauntInfo } from "@/http/get-restaurant-info"
import { cn } from "@/lib/utils"

import { Info } from "./info"
import { InfoSkeleton } from "./info-skeleton"
import { ProductCard } from "./product-card"
import { ProductCardSkeleton } from "./product-card-skeleton"

export function Restaurant() {
  const { restaurantId } = useParams() as { restaurantId: string }

  const { data: menu } = useQuery({
    queryKey: ["restaurant-menu", restaurantId],
    queryFn: () => getMenu({ restaurantId }),
  })

  const { data: info } = useQuery({
    queryKey: ["restaurant-info", restaurantId],
    queryFn: () => getRestarauntInfo({ restaurantId }),
  })

  return (
    <div className="flex flex-col gap-6">
      {info ? (
        <>
          <Seo
            title={info?.restaurant.name}
            image={info?.restaurant.image ?? undefined}
          />

          <div
            className={cn(
              "flex items-center justify-center lg:justify-normal relative h-40 lg:h-80 overflow-hidden -mx-4 lg:mx-0 -mt-8 before:absolute before:size-full before:bg-black/75",
              !info?.restaurant.isOpen && "before:z-1",
            )}
          >
            <div className="absolute bg-[url(/banner.jpg)] h-full w-full bg-no-repeat bg-cover bg-position-[center_bottom_200px] lg:bg-position-[center_bottom_50px] bg-fixed" />

            {!info?.restaurant.isOpen && (
              <div className="z-10 lg:px-16 text-muted flex items-center gap-4">
                <div className="rounded-full border border-muted p-4">
                  <StoreIcon className="size-8" />
                </div>

                <div>
                  <p className="font-semibold text-xl">Loja fechada</p>
                  <span className="font-medium">
                    Abre às {info?.restaurant.openingAt}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Info
            restaurant={info.restaurant}
            rateResume={info.rateResume}
            rateByGrade={info.rateByGrade}
            rates={info.rates}
          />
        </>
      ) : (
        <>
          <Skeleton className="w-full h-40 lg:h-80 -mt-8" />

          <InfoSkeleton />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menu ? (
          menu?.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              closedRestaurant={!info?.restaurant.isOpen}
            />
          ))
        ) : (
          <ProductCardSkeleton />
        )}
      </div>
    </div>
  )
}
