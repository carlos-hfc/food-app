import { api } from "@/lib/axios"

export interface GetProductDetailsRequest {
  productId: string
}

export interface GetProductDetailsResponse {
  id: string
  name: string
  description: string
  price: number
  image: string | null
}

export async function getProductDetails({
  productId,
}: GetProductDetailsRequest) {
  const response = await api.get<GetProductDetailsResponse>(
    `/products/${productId}`,
  )

  return response.data
}
