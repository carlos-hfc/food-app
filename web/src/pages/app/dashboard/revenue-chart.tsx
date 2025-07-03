import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { Loader2Icon } from "lucide-react"
import { useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import colors from "tailwindcss/colors"

import { DateRangePicker } from "@/components/date-range-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getDailyRevenueInPeriod } from "@/http/get-daily-revenue-in-period"

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
          <ResponsiveContainer
            width="100%"
            height={240}
          >
            <LineChart
              style={{ fontSize: 12 }}
              data={chartData}
            >
              <CartesianGrid
                vertical={false}
                className="stroke-muted"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                dy={16}
              />
              <YAxis
                stroke="#888"
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
              <Line
                type="linear"
                strokeWidth={2}
                dataKey="receipt"
                stroke={colors.violet[500]}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex w-full items-center justify-center h-60">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
