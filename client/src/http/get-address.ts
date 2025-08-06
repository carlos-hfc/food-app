import { api } from "@/lib/axios"

export interface GetAddressRequest {
  addressId: string
}

export interface GetAddressResponse {
  id: string
  zipCode: string
  address: string
  number: number | null
  district: string
  city: string
  uf: string
  alias: string | null
  main: boolean
}

export async function getAddress({ addressId }: GetAddressRequest) {
  const response = await api.get<GetAddressResponse>(`/address/${addressId}`)

  return response.data
}
