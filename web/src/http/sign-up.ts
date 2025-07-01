import { api } from "@/lib/axios"

export interface SignUpRequest {
  managerName: string
  restaurantName: string
  email: string
  password: string
  phone: string
  tax: number
  deliveryTime: number
  categoryId: string
  hours: {
    weekday: string
    openedAt: string
    closedAt: string
    open: boolean
  }[]
}

export async function signUp({
  email,
  password,
  categoryId,
  deliveryTime,
  hours,
  managerName,
  phone,
  restaurantName,
  tax,
}: SignUpRequest) {
  await api.post("/restaurant", {
    email,
    password,
    categoryId,
    deliveryTime,
    hours,
    managerName,
    phone,
    restaurantName,
    tax,
  })
}
