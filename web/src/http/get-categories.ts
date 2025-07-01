import { api } from "@/lib/axios"

export interface GetCategoriesResponse {
  categories: {
    name: string
    id: string
  }[]
}

export async function getCategories() {
  const response = await api.get<GetCategoriesResponse>("/category")

  return response.data.categories
}
