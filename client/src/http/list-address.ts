import { api } from "@/lib/axios"

export type ListAddressResponse = Array<{
  id: string
  zipCode: string
  address: string
  number: number | null
  district: string
  city: string
  uf: string
  alias: string | null
  main: boolean
}>

export async function listAddress() {
  const response = await api.get<ListAddressResponse>("/address")

  return response.data
}
