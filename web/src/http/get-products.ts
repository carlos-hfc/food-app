import { api } from "@/lib/axios"

export interface GetProductsRequest {
  pageIndex?: number | null
  active?: string | null
  available?: string | null
}

export interface GetProductsResponse {
  products: {
    id: string
    name: string
    image: string | null
    price: number
    available: boolean
    active: boolean
  }[]
  meta: {
    totalCount: number
    pageIndex: number
    perPage: number
  }
}

export async function getProducts({
  active,
  available,
  pageIndex,
}: GetProductsRequest) {
  const response = await api.get<GetProductsResponse>("/product", {
    params: {
      pageIndex: pageIndex ?? 0,
      available: available === "all" ? null : available,
      active: active === "all" ? null : active,
    },
  })

  return response.data
}
