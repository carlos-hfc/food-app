import { api } from "@/lib/axios"

export interface GetEvaluationsRequest {
  pageIndex?: number | null
  rate?: string | null
  comment?: string | null
}

export interface GetEvaluationsResponse {
  evaluations: {
    id: string
    customerName: string
    rate: number
    comment: string | null
    createdAt: string
  }[]
  meta: {
    totalCount: number
    pageIndex: number
    perPage: number
  }
}
export async function getEvaluations({
  pageIndex,
  comment,
  rate,
}: GetEvaluationsRequest) {
  const response = await api.get<GetEvaluationsResponse>("/evaluations", {
    params: {
      pageIndex: pageIndex ?? 0,
      comment: comment === "all" ? null : comment,
      rate: rate === "all" ? null : rate,
    },
  })

  return response.data
}
