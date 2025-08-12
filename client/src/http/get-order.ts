import { api } from "@/lib/axios"

export interface GetOrderRequest {
  orderId: string
}

export interface GetOrderResponse {
  id: string
  date: string
  preparedAt: string | null
  routedAt: string | null
  deliveredAt: string | null
  canceledAt: string | null
  status: "PENDING" | "PREPARING" | "ROUTING" | "DELIVERED" | "CANCELED"
  payment: "CARD" | "CASH" | "PIX"
  total: number
  client: {
    name: string
    phone: string
    email: string
  }
  restaurant: {
    id: string
    name: string
    image: string | null
    tax: number
  }
  products: {
    id: string
    name: string
    image: string | null
    price: number
    quantity: number
  }[]
  address: {
    street: string
    number: number
    district: string
    city: string
    state: string
  }
  rate: number | null
}

export async function getOrder({ orderId }: GetOrderRequest) {
  const response = await api.get<GetOrderResponse>(`/order/${orderId}`)

  return response.data
}
