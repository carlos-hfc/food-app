import { api } from "@/lib/axios"

export interface GetOrdersRequest {
  pageIndex: string
}

export interface GetOrdersResponse {
  orders: {
    id: string
    date: string
    status: "PENDING" | "PREPARING" | "ROUTING" | "DELIVERED" | "CANCELED"
    payment: "CARD" | "CASH" | "PIX"
    total: number
    grade: number | null
    client: {
      name: string
    }
  }[]
  meta: {
    totalCount: number
    pageIndex: number
    perPage: number
  }
}

export async function getOrders() {
  const response = await api.get<GetOrdersResponse>("/order", {
    params: {
      pageIndex: 0,
    },
  })

  return response.data
}
