import { useQuery } from "@tanstack/react-query"

import { Seo } from "@/components/seo"
import { listFavorites } from "@/http/list-favorites"

import { EmptyFavorites } from "./empty-favorites"
import { FavoriteItem } from "./favorite-item"
import { FavoriteItemSkeleton } from "./favorite-item-skeleton"

export function Favorites() {
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: listFavorites,
  })

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Favoritos" />

      <div className="space-y-3">
        <span className="text-xl lg:text-2xl block font-bold">
          Meus favoritos
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingFavorites ? (
            <FavoriteItemSkeleton />
          ) : favorites && favorites?.length > 0 ? (
            favorites.map(favorite => (
              <FavoriteItem
                key={favorite.id}
                favorite={favorite}
              />
            ))
          ) : (
            <EmptyFavorites />
          )}
        </div>
      </div>
    </div>
  )
}
