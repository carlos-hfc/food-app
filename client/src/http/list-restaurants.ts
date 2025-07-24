import { api } from "@/lib/axios"

export interface ListRestaurantsRequest {
  name?: string | null
  category?: string | null
  tax?: number | null
  deliveryTime?: number | null
  grade?: number | null
}

export type ListRestaurantsResponse = Array<{
  id: string
  name: string
  tax: number
  deliveryTime: number
  image: string | null
  grade: number
  category: string
  isOpen: boolean
  openingAt?: string
}>

export async function listRestaurants({
  category,
  deliveryTime,
  grade,
  name,
  tax,
}: ListRestaurantsRequest) {
  const response = await api.get<ListRestaurantsResponse>("/restaurant", {
    params: {
      category,
      deliveryTime,
      grade,
      name,
      tax,
    },
  })

  return response.data
}
