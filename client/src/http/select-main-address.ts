import { api } from "@/lib/axios"

export interface SelectMainAddressRequest {
  addressId: string
}

export async function selectMainAddress({
  addressId,
}: SelectMainAddressRequest) {
  await api.patch(`/addresses/${addressId}/main`)
}
