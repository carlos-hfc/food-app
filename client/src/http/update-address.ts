import { api } from "@/lib/axios"

export interface GetAddressRequest {
  addressId: string
  zipCode: string
  address: string
  number: number | null
  district: string
  city: string
  uf: string
  alias: string | null
  main: boolean
}

export async function updateAddress({
  addressId,
  address,
  alias,
  city,
  district,
  main,
  number,
  uf,
  zipCode,
}: GetAddressRequest) {
  await api.patch(`/address/${addressId}`, {
    address,
    alias,
    city,
    district,
    main,
    number,
    uf,
    zipCode,
  })
}
