import { api } from "@/lib/axios"

export interface GetOrderDetailsRequest {
  orderId: string
}

export interface GetOrderDetailsResponse {
  id: string
  date: string
  status: "PENDING" | "PREPARING" | "ROUTING" | "DELIVERED" | "CANCELED"
  payment: "CARD" | "CASH" | "PIX"
  total: number
  client: {
    name: string
    phone: string
    email: string
  }
  restaurant: {
    tax: number
  }
  products: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}

export async function getOrderDetails({ orderId }: GetOrderDetailsRequest) {
  const response = await api.get<GetOrderDetailsResponse>(`/order/${orderId}`)

  return response.data
}
