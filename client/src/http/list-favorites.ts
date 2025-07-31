import { api } from "@/lib/axios"

export type ListFavoritesRequest = Array<{
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
}>

export async function listFavorites() {
  const response = await api.get<ListFavoritesRequest>("/favorite")

  return response.data
}
