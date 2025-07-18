import { api } from "@/lib/axios"

export type GetBestRestaurantsResponse = Array<{
  id: string
  name: string
  image: string | null
  category: string
}>

export async function getBestRestaurants() {
  const response =
    await api.get<GetBestRestaurantsResponse>("/best-restaurants")

  return response.data
}
