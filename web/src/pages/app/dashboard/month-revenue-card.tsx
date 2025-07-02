import { useQuery } from "@tanstack/react-query"
import { DollarSignIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMonthRevenue } from "@/http/get-month-revenue"

import { MetricCardSkeleton } from "./metric-card-skeleton"

export function MonthRevenueCard() {
  const { data: monthRevenue } = useQuery({
    queryFn: getMonthRevenue,
    queryKey: ["metrics", "month-revenue"],
  })

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Receita total (mês)
        </CardTitle>
        <DollarSignIcon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        {monthRevenue ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {monthRevenue.receipt.toLocaleString("pt-BR")}
            </span>
            <p className="text-sm text-muted-foreground">
              {monthRevenue.diffFromLastMonth >= 0 ? (
                <span className="text-emerald-500 dark:text-emerald-400">
                  +{monthRevenue.diffFromLastMonth}%{" "}
                </span>
              ) : (
                <span className="text-rose-500 dark:text-rose-400">
                  {monthRevenue.diffFromLastMonth}%{" "}
                </span>
              )}
              em relação ao mês passado
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
