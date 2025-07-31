import { useMutation, useQuery } from "@tanstack/react-query"
import { HeartIcon, StoreIcon } from "lucide-react"
import { useParams } from "react-router"
import { toast } from "sonner"

import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { addFavorite } from "@/http/add-favorite"
import { getMenu } from "@/http/get-menu"
import { getRestarauntInfo } from "@/http/get-restaurant-info"
import { listFavorites, ListFavoritesResponse } from "@/http/list-favorites"
import { queryClient } from "@/lib/react-query"
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

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: listFavorites,
  })

  const isFavorited = favorites?.find(
    item => item.restaurantId === restaurantId,
  )

  const { mutateAsync: addFavoriteFn, isPending: isFavoriting } = useMutation({
    mutationFn: addFavorite,
    onSuccess({ favoriteId }, { restaurantId }) {
      queryClient.setQueryData<ListFavoritesResponse>(
        ["favorites"],
        oldData => {
          const today = info?.restaurant.hours.find(
            item => item.weekday === new Date().getDay(),
          )

          return [
            ...(oldData ?? []),
            {
              id: favoriteId,
              restaurantId,
              restaurantName: info?.restaurant.name ?? "",
              tax: info?.restaurant.tax ?? 0,
              deliveryTime: info?.restaurant.deliveryTime ?? 0,
              image: info?.restaurant.image ?? null,
              category: info?.restaurant.category ?? "",
              weekday: today?.weekday ?? new Date().getDay(),
              open: today?.open ?? true,
              openedAt: today?.openedAt ?? "",
              closedAt: today?.closedAt ?? "",
              isOpen: info?.restaurant.isOpen ?? true,
              openingAt: info?.restaurant.openingAt,
            },
          ]
        },
      )
    },
  })

  async function handleFavorite() {
    try {
      await addFavoriteFn({ restaurantId })

      toast.success("Favorito salvo com sucesso!")
    } catch (error) {
      toast.error("Falha ao salvar favorito, tente novamente")
    }
  }

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

            <Button
              size="icon"
              className="bg-foreground hover:bg-foreground rounded-full z-1 absolute top-2 lg:top-4 right-2 lg:right-4 size-10"
              onClick={handleFavorite}
              disabled={isFavoriting}
            >
              <HeartIcon
                className={cn(
                  "stroke-background size-5",
                  isFavorited && "fill-background",
                )}
              />
            </Button>

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
