import { api } from "@/lib/axios"

export interface ToggleAvailableProductRequest {
  productId: string
}

export async function toggleAvailableProduct({
  productId,
}: ToggleAvailableProductRequest) {
  await api.patch(`/product/${productId}/available`)
}
