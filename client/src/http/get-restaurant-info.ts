import { api } from "@/lib/axios"

export interface GetRestarauntInfoRequest {
  restaurantId: string
}

export interface GetRestarauntInfoResponse {
  restaurant: {
    id: string
    name: string
    phone: string
    category: string
    image: string | null
    tax: number
    deliveryTime: number
    isOpen: boolean
    openingAt?: string
    hours: {
      hourId: string
      weekday: number
      openedAt: string
      closedAt: string
      open: boolean
    }[]
  }
  rates: {
    id: string
    client: string
    rate: number
    comment: string | null
    createdAt: string
  }[]
  rateResume: {
    totalCount: number
    average: number
  }
  evaluationByRate: {
    count: number
    rate: number
  }[]
}

export async function getRestarauntInfo({
  restaurantId,
}: GetRestarauntInfoRequest) {
  const response = await api.get<GetRestarauntInfoResponse>(
    `/restaurants/${restaurantId}/info`,
  )

  return response.data
}
