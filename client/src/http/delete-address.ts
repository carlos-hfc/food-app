import { api } from "@/lib/axios"

export interface DeleteAddressRequest {
  addressId: string
}

export async function deleteAddress({ addressId }: DeleteAddressRequest) {
  await api.delete(`/addresses/${addressId}`)
}
