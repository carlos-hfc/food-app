import { api } from "@/lib/axios"

export interface AddFavoriteRequest {
  restaurantId: string
}

export interface AddFavoriteResponse {
  favoriteId: string
}

export async function addFavorite({ restaurantId }: AddFavoriteRequest) {
  const response = await api.post<AddFavoriteResponse>("/favorite", {
    restaurantId,
  })

  return response.data
}
