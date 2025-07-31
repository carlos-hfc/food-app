import { api } from "@/lib/axios"

export interface AddFavoriteRequest {
  restaurantId: string
}

export async function addFavorite({ restaurantId }: AddFavoriteRequest) {
  await api.post("/favorite", { restaurantId })
}
