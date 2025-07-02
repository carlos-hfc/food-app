import { useQuery } from "@tanstack/react-query"
import { DollarSignIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMonthCanceledOrdersAmount } from "@/http/get-month-canceled-orders-amount"

import { MetricCardSkeleton } from "./metric-card-skeleton"

export function MonthCanceledOrdersAmountCard() {
  const { data: monthOrdersCanceledAmount } = useQuery({
    queryFn: getMonthCanceledOrdersAmount,
    queryKey: ["metrics", "month-canceled-orders-amount"],
  })

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Cancelamentos (mês)
        </CardTitle>
        <DollarSignIcon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        {monthOrdersCanceledAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {monthOrdersCanceledAmount.amount.toLocaleString("pt-BR")}
            </span>
            <p className="text-sm text-muted-foreground">
              {monthOrdersCanceledAmount.diffFromLastMonth >= 0 ? (
                <span className="text-emerald-500 dark:text-emerald-400">
                  +{monthOrdersCanceledAmount.diffFromLastMonth}%{" "}
                </span>
              ) : (
                <span className="text-rose-500 dark:text-rose-400">
                  {monthOrdersCanceledAmount.diffFromLastMonth}%{" "}
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
