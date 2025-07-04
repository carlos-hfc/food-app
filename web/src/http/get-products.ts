import { api } from "@/lib/axios"

export interface GetProductsResponse {
  products: {
    id: string
    name: string
    price: number
    available: boolean
  }[]
}

export async function getProducts() {
  const response = await api.get<GetProductsResponse>("/product")

  return response.data
}
