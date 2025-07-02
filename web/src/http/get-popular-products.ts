import { api } from "@/lib/axios"

export type GetPopularProductsResponse = Array<{
  amount: number
  product: string
}>

export async function getPopularProducts() {
  const response = await api.get<GetPopularProductsResponse>(
    "/metrics/popular-products",
  )

  return response.data
}
