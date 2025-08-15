import { api } from "@/lib/axios"

export interface ListRestaurantsRequest {
  name?: string | null
  category?: string | null
  tax?: string | null
  deliveryTime?: string | null
  rate?: string | null
}

export type ListRestaurantsResponse = Array<{
  id: string
  name: string
  tax: number
  deliveryTime: number
  image: string | null
  rate: number
  category: string
  isOpen: boolean
  openingAt?: string
}>

export async function listRestaurants({
  category,
  deliveryTime,
  rate,
  name,
  tax,
}: ListRestaurantsRequest) {
  const response = await api.get<ListRestaurantsResponse>("/restaurants", {
    params: {
      category: category === "all" ? undefined : category,
      deliveryTime: deliveryTime === "all" ? undefined : deliveryTime,
      rate: rate === "all" ? undefined : rate,
      tax: tax === "all" ? undefined : tax,
      name,
    },
  })

  return response.data
}
