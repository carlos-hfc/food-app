import { api } from "@/lib/axios"

export interface ListCategoriesRequest {
  name?: string | null
}

export type ListCategoriesResponse = Array<{
  id: string
  name: string
}>

export async function listCategories({ name }: ListCategoriesRequest) {
  const response = await api.get<ListCategoriesResponse>("/category", {
    params: {
      name,
    },
  })

  return response.data
}
