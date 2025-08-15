import { api } from "@/lib/axios"

export interface GetMenuRequest {
  restaurantId: string
}

export type GetMenuResponse = Array<{
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string | null
}>

export async function getMenu({ restaurantId }: GetMenuRequest) {
  const response = await api.get<GetMenuResponse>(
    `/restaurants/${restaurantId}/menu`,
  )

  return response.data
}
