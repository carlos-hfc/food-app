import { api } from "@/lib/axios"

export interface ApproveOrderRequest {
  orderId: string
}

export async function approveOrder({ orderId }: ApproveOrderRequest) {
  await api.patch(`/order/${orderId}/approve`)
}
