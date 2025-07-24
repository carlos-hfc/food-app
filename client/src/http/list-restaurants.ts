import { api } from "@/lib/axios"

export interface ListRestaurantsRequest {
  name?: string | null
  category?: string | null
  tax?: string | null
  deliveryTime?: string | null
  grade?: string | null
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
      category: category === "all" ? undefined : category,
      deliveryTime: deliveryTime === "all" ? undefined : deliveryTime,
      grade: grade === "all" ? undefined : grade,
      tax: tax === "all" ? undefined : tax,
      name,
    },
  })

  return response.data
}
