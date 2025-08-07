import { api } from "@/lib/axios"

export type ListOrdersResponse = Array<{
  id: string
  status: string
  payment: string
  date: string
  preparedAt: string | null
  routedAt: string | null
  deliveredAt: string | null
  canceledAt: string | null
  rate: number | null
  restaurant: {
    id: string
    name: string
    image: string | null
  }
  products: {
    id: string
    quantity: number
    name: string
    image: string | null
    price: number
  }[]
}>

export async function listOrders() {
  const response = await api.get<ListOrdersResponse>("/order/me")

  return response.data
}
