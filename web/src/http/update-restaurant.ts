import { api } from "@/lib/axios"

export interface UpdateRestaurantRequest {
  id: string
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
  id,
}: UpdateRestaurantRequest) {
  await api.patch(`/restaurant/${id}`, {
    categoryId,
    deliveryTime,
    hours,
    name,
    phone,
    tax,
  })
}
