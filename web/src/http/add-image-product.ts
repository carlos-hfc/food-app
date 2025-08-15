import { api } from "@/lib/axios"

export interface AddImageProductRequest {
  productId: string
  file: File
}

export interface AddImageProductResponse {
  image: string
}

export async function addImageProduct({
  file,
  productId,
}: AddImageProductRequest) {
  const data = new FormData()

  data.append("file", file)

  const response = await api.patch<AddImageProductResponse>(
    `/products/${productId}/image`,
    data,
  )

  return response.data
}
