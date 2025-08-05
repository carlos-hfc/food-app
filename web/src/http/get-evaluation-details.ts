import { api } from "@/lib/axios"

export interface GetEvaluationDetailsRequest {
  evaluationId: string
}

export interface GetEvaluationDetailsResponse {
  id: string
  rate: number
  createdAt: string
  comment: string | null
  date: string
  total: number
  tax: number
  customer: {
    name: string
    phone: string
    email: string
  }
  products: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}
export async function getEvaluationDetails({
  evaluationId,
}: GetEvaluationDetailsRequest) {
  const response = await api.get<GetEvaluationDetailsResponse>(
    `/evaluations/${evaluationId}`,
  )

  return response.data
}
