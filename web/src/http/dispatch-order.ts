import { api } from "@/lib/axios"

export interface DispatchOrderRequest {
  orderId: string
}

export async function dispatchOrder({ orderId }: DispatchOrderRequest) {
  await api.patch(`/order/${orderId}/dispatch`)
}
