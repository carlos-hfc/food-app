import { api } from "@/lib/axios"

export interface UpdateRestaurantRequest {
  name: string
  categoryId: string
  deliveryTime: number
  tax: number
  phone: string
  hours: {
    hourId: string
    openedAt: string
    closedAt: string
    open: boolean
  }[]
}

export async function updateRestaurant({
  categoryId,
  deliveryTime,
  hours,
  name,
  phone,
  tax,
}: UpdateRestaurantRequest) {
  await api.put(`/restaurants`, {
    categoryId,
    deliveryTime,
    hours,
    name,
    phone,
    tax,
  })
}
