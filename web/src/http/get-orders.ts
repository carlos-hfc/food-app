import { api } from "@/lib/axios"

export interface GetOrdersRequest {
  pageIndex?: number | null
  status?: string | null
  payment?: string | null
}

export interface GetOrdersResponse {
  orders: {
    id: string
    date: string
    status: "PENDING" | "PREPARING" | "ROUTING" | "DELIVERED" | "CANCELED"
    payment: "CARD" | "CASH" | "PIX"
    total: number
    customerName: string
  }[]
  meta: {
    totalCount: number
    pageIndex: number
    perPage: number
  }
}

export async function getOrders({
  pageIndex,
  payment,
  status,
}: GetOrdersRequest) {
  const response = await api.get<GetOrdersResponse>("/orders", {
    params: {
      pageIndex: pageIndex ?? 0,
      status: status === "all" ? null : status,
      payment: payment === "all" ? null : payment,
    },
  })

  return response.data
}
