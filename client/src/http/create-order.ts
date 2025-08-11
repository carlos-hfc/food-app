import { api } from "@/lib/axios"

export interface CreateOrderRequest {
  restaurantId: string
  addressId: string
  payment: string
  products: {
    id: string
    quantity: number
  }[]
}

export async function createOrder({
  addressId,
  payment,
  products,
  restaurantId,
}: CreateOrderRequest) {
  await api.post(`/restaurant/${restaurantId}/order`, {
    addressId,
    payment,
    products,
  })
}
