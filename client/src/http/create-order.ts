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

export interface CreateOrderResponse {
  orderId: string
  total: number
}

export async function createOrder({
  addressId,
  payment,
  products,
  restaurantId,
}: CreateOrderRequest) {
  const response = await api.post<CreateOrderResponse>(`/orders`, {
    restaurantId,
    addressId,
    payment,
    products,
  })

  return response.data
}
