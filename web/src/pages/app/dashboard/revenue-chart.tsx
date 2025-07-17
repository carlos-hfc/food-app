import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { Loader2Icon } from "lucide-react"
import { useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { DateRangePicker } from "@/components/date-range-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { getDailyRevenueInPeriod } from "@/http/get-daily-revenue-in-period"

const chartConfig = {
  receipt: {
    label: "Receita",
  },
} satisfies ChartConfig

export function RevenueChart() {
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const { data: dailyRevenueInPeriod } = useQuery({
    queryFn: () => getDailyRevenueInPeriod(date),
    queryKey: ["metrics", "daily-revenue-in-period", date],
  })

  const chartData = useMemo(() => dailyRevenueInPeriod, [dailyRevenueInPeriod])

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Label>Período</Label>
          <DateRangePicker
            date={date}
            onDateChange={setDate}
          />
        </div>
      </CardHeader>

      <CardContent>
        {chartData ? (
          <ChartContainer
            config={chartConfig}
            className="h-60 w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              className="text-xs"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={16}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(value: number) =>
                  value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="text-muted-foreground flex min-w-32 items-center text-xs">
                        {chartConfig[name as keyof typeof chartConfig].label}
                        <div className="text-foreground ml-auto font-mono font-medium tabular-nums">
                          {value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Line
                dataKey="receipt"
                type="linear"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex w-full items-center justify-center h-60">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
