import { api } from "@/lib/axios"

export type ListFavoritesResponse = Array<{
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
  const response = await api.get<ListFavoritesResponse>("/favorites")

  return response.data
}
