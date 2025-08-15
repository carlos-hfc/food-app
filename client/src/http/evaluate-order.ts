import { api } from "@/lib/axios"

export interface EvaluateOrderProps {
  orderId: string
  rate: number
  comment?: string
}

export async function evaluateOrder({
  orderId,
  rate,
  comment,
}: EvaluateOrderProps) {
  await api.post(`/evaluations`, {
    orderId,
    rate,
    comment,
  })
}
