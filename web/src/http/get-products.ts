import { api } from "@/lib/axios"

export interface GetProductsResponse {
  products: {
    id: string
    restaurantId: string
    name: string
    description: string
    price: number
    available: boolean
    image: string | null
  }[]
}

export async function getProducts() {
  const response = await api.get<GetProductsResponse>("/product")

  return response.data
}
