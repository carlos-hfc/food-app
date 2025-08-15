import { api } from "@/lib/axios"

export interface ToggleActiveProductRequest {
  productId: string
}

export async function toggleActiveProduct({
  productId,
}: ToggleActiveProductRequest) {
  await api.patch(`/products/${productId}/active`)
}
