import { api } from "@/lib/axios"

export interface DeleteFavoriteRequest {
  favoriteId: string
}

export async function deleteFavorite({ favoriteId }: DeleteFavoriteRequest) {
  await api.delete(`/favorite/${favoriteId}`)
}
