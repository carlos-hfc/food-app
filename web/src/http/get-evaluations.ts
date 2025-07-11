import { api } from "@/lib/axios"

export interface GetEvaluationsRequest {
  pageIndex?: number | null
  grade?: string | null
  comment?: string | null
}

export interface GetEvaluationsResponse {
  evaluations: {
    orderId: string
    customerName: string
    grade: number
    comment: string | null
    ratingDate: string
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
  grade,
}: GetEvaluationsRequest) {
  const response = await api.get<GetEvaluationsResponse>("/evaluations", {
    params: {
      pageIndex: pageIndex ?? 0,
      comment: comment === "all" ? null : comment,
      grade: grade === "all" ? null : grade,
    },
  })

  return response.data
}
