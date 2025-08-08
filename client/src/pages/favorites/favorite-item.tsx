import { useMutation } from "@tanstack/react-query"
import { HeartIcon } from "lucide-react"
import { MouseEvent } from "react"
import { Link } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deleteFavorite } from "@/http/delete-favorite"
import { ListFavoritesResponse } from "@/http/list-favorites"
import { formatPriceNumber } from "@/lib/format-price-number"
import { queryClient } from "@/lib/react-query"
import { cn } from "@/lib/utils"

interface FavoriteItemProps {
  favorite: {
    id: string
    restaurantId: string
    restaurantName: string
    tax: number
    deliveryTime: number
    image: string | null
    category: string
    weekday: number
    open: boolean
    openedAt: string
    closedAt: string
    isOpen: boolean
    openingAt?: string
  }
}

export function FavoriteItem({ favorite }: FavoriteItemProps) {
  const { mutateAsync: deleteFavoriteFn, isPending: isDeletingFavorite } =
    useMutation({
      mutationFn: deleteFavorite,
      onSuccess(_, { favoriteId }) {
        const cached = queryClient.getQueryData<ListFavoritesResponse>([
          "favorites",
        ])

        if (cached) {
          queryClient.setQueryData<ListFavoritesResponse>(
            ["favorites"],
            cached.filter(item => item.id !== favoriteId),
          )
        }
      },
    })

  async function handleDeleteFavorite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    try {
      await deleteFavoriteFn({
        favoriteId: favorite.id,
      })

      toast.success("Favorito removido com sucesso!")
    } catch (error) {
      toast.error("Falha ao remover favorito, tente novamente")
    }
  }

  return (
    <Link
      to={`/restaurantes/${favorite.restaurantId}`}
      className={cn(
        "flex items-center gap-2 hover:shadow-md rounded-md px-4 py-2",
        isDeletingFavorite && "pointer-events-none opacity-80",
      )}
    >
      <img
        src={favorite.image ?? "/hamburger.webp"}
        alt={favorite.restaurantName}
        className={cn(
          "rounded-full size-20 object-cover",
          !favorite.isOpen && "saturate-0",
        )}
      />

      <div className={cn("flex flex-col", !favorite.isOpen && "saturate-0")}>
        <p className="font-semibold line-clamp-1">{favorite.restaurantName}</p>
        <span className="text-muted-foreground text-sm">
          {favorite.category}
        </span>
        <div className="text-xs text-muted-foreground mt-2">
          <span className={cn(!favorite.isOpen && "font-bold")}>
            {favorite.isOpen
              ? `${favorite.deliveryTime}-${favorite.deliveryTime + 10} min`
              : "Fechado"}
          </span>{" "}
          -{" "}
          <span className={cn(favorite.tax === 0 && "text-green-600")}>
            {favorite.tax === 0 ? "Grátis" : formatPriceNumber(favorite.tax)}
          </span>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="ml-auto self-center"
        onClick={handleDeleteFavorite}
        aria-label="Restaurante favoritado"
      >
        <HeartIcon className="size-6 fill-primary stroke-primary shrink-0" />
      </Button>
    </Link>
  )
}
