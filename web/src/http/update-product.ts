import { api } from "@/lib/axios"

export interface UpdateProductRequest {
  productId: string
  name: string
  description: string
  price: number
}

export async function updateProduct({
  productId,
  name,
  price,
  description,
}: UpdateProductRequest) {
  await api.patch(`/product/${productId}`, {
    name,
    price,
    description,
  })
}
