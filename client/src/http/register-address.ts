import { api } from "@/lib/axios"

export interface RegisterAddressRequest {
  alias?: string
  zipCode: string
  address: string
  number?: number
  district: string
  city: string
  uf: string
  main?: boolean
}

export interface RegisterAddressResponse {
  addressId: string
}

export async function registerAddress({
  address,
  city,
  district,
  uf,
  zipCode,
  alias,
  main,
  number,
}: RegisterAddressRequest) {
  const response = await api.post<RegisterAddressResponse>("/address", {
    address,
    city,
    district,
    uf,
    zipCode,
    alias,
    main,
    number,
  })

  return response.data
}
