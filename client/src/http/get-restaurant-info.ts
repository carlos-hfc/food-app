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
    grade: number
    comment: string | null
    ratingDate: string
  }[]
  rateResume: {
    totalCount: number
    average: number
  }
  rateByGrade: {
    count: number
    grade: number
  }[]
}

export async function getRestarauntInfo({
  restaurantId,
}: GetRestarauntInfoRequest) {
  const response = await api.get<GetRestarauntInfoResponse>(
    `/restaurant/${restaurantId}/info`,
  )

  return response.data
}
