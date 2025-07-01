import { api } from "@/lib/axios"

export interface GetManagedRestaurantResponse {
  id: string
  name: string
}

export async function getManagedRestaurant() {
  const response = await api.get<GetManagedRestaurantResponse>(
    "/managed-restaurant",
  )

  return response.data
}
