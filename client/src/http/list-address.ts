import { api } from "@/lib/axios"

export type ListAddressResponse = Array<{
  id: string
  zipCode: string
  street: string
  number: number
  district: string
  city: string
  state: string
  alias: string | null
  main: boolean
}>

export async function listAddress() {
  const response = await api.get<ListAddressResponse>("/addresses")

  return response.data
}
