import { api } from "@/lib/axios"

export interface UpdateAddressRequest {
  addressId: string
  zipCode: string
  street: string
  number: number
  district: string
  city: string
  state: string
  alias: string | null
  main: boolean
}

export async function updateAddress({
  addressId,
  street,
  alias,
  city,
  district,
  main,
  number,
  state,
  zipCode,
}: UpdateAddressRequest) {
  await api.put(`/addresses/${addressId}`, {
    street,
    alias,
    city,
    district,
    main,
    number,
    state,
    zipCode,
  })
}
