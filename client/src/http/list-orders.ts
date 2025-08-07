import { api } from "@/lib/axios"

export type ListOrdersResponse = Array<{
  id: string
  status: string
  date: string
  rate: number | null
  restaurant: {
    name: string
    image: string | null
  }
  products: {
    quantity: number
    product: string
  }[]
}>

export async function listOrders() {
  const response = await api.get<ListOrdersResponse>("/order/me")

  return response.data
}
