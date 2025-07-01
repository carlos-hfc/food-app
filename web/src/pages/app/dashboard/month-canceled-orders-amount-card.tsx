import { DollarSignIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MonthCanceledOrdersAmountCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Cancelamentos (mês)
        </CardTitle>
        <DollarSignIcon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">12</span>
        <p className="text-sm text-muted-foreground">
          <span className="text-rose-500 dark:text-rose-400">-4%</span> em
          relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
