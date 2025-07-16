import { api } from "@/lib/axios"

export interface RegisterProductRequest {
  name: string
  description: string
  price: number
}

export async function registerProduct({
  description,
  name,
  price,
}: RegisterProductRequest) {
  await api.post("/product", {
    description,
    name,
    price,
  })
}
