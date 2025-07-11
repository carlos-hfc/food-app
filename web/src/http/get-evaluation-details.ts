import { api } from "@/lib/axios"

export interface GetEvaluationDetailsRequest {
  orderId: string
}

export interface GetEvaluationDetailsResponse {
  id: string
  date: string
  total: number
  grade: number
  ratingDate: string
  comment: string | null
  client: {
    name: string
    phone: string
    email: string
  }
  tax: number
  products: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}
export async function getEvaluationDetails({
  orderId,
}: GetEvaluationDetailsRequest) {
  const response = await api.get<GetEvaluationDetailsResponse>(
    `/evaluations/${orderId}`,
  )

  return response.data
}
