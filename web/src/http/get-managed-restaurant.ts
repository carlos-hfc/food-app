import { api } from "@/lib/axios"

export interface GetManagedRestaurantResponse {
  id: string
  name: string
  categoryId: string
  deliveryTime: number
  tax: number
  phone: string
  hours: {
    id: string
    weekday: number
    openedAt: string
    closedAt: string
    open: boolean
  }[]
}

export async function getManagedRestaurant() {
  const response = await api.get<GetManagedRestaurantResponse>(
    "/managed-restaurant",
  )

  return response.data
}
