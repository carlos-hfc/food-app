import { api } from "@/lib/axios"

export type GetCategoriesResponse = Array<{
  name: string
  id: string
}>

export async function getCategories() {
  const response = await api.get<GetCategoriesResponse>("/categories")

  return response.data
}
