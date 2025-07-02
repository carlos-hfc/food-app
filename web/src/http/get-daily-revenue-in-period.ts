import { api } from "@/lib/axios"

export interface GetDailyRevenueInPeriodRequest {
  from?: Date
  to?: Date
}

export type GetDailyRevenueInPeriodResponse = Array<{
  receipt: number
  date: string
}>

export async function getDailyRevenueInPeriod({
  from,
  to,
}: GetDailyRevenueInPeriodRequest) {
  const response = await api.get<GetDailyRevenueInPeriodResponse>(
    "/metrics/daily-receipt-in-period",
    {
      params: {
        from,
        to,
      },
    },
  )

  return response.data
}
