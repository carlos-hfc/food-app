import { api } from "@/lib/axios"

export interface AddImageRestaurantRequest {
  file: File
}

export interface AddImageRestaurantResponse {
  image: string
}

export async function addImageRestaurant({ file }: AddImageRestaurantRequest) {
  const data = new FormData()

  data.append("file", file)

  const response = await api.patch<AddImageRestaurantResponse>(
    "/restaurant/image",
    data,
  )

  return response.data
}
