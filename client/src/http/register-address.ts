import { api } from "@/lib/axios"

export interface RegisterAddressRequest {
  alias: string | null
  zipCode: string
  street: string
  number: number
  district: string
  city: string
  state: string
  main: boolean
}

export interface RegisterAddressResponse {
  addressId: string
}

export async function registerAddress({
  street,
  city,
  district,
  state,
  zipCode,
  alias,
  main,
  number,
}: RegisterAddressRequest) {
  const response = await api.post<RegisterAddressResponse>("/addresses", {
    street,
    city,
    district,
    state,
    zipCode,
    alias,
    main,
    number,
  })

  return response.data
}
