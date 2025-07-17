import { useQuery } from "@tanstack/react-query"
import { BarChartIcon, Loader2Icon } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getPopularProducts } from "@/http/get-popular-products"

const chartConfig = {
  amount: {
    label: "Quantidade",
  },
}

export function PopularProductsChart() {
  const { data: popularProducts } = useQuery({
    queryFn: getPopularProducts,
    queryKey: ["metrics", "popular-products"],
  })

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Produtos populares
          </CardTitle>
          <BarChartIcon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        {popularProducts ? (
          <ChartContainer
            config={chartConfig}
            className="h-60 w-full"
          >
            <PieChart className="text-xs">
              <ChartTooltip
                content={<ChartTooltipContent className="w-48" />}
              />
              <Pie
                data={popularProducts}
                dataKey="amount"
                nameKey="product"
                label={({ product, amount }) =>
                  `${product.substring(0, 12).concat("...")} - (${amount})`
                }
                outerRadius={86}
                innerRadius={64}
                cx="50%"
                cy="50%"
                labelLine={false}
              >
                {popularProducts.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`var(--chart-${i + 1})`}
                    className="stroke-background hover:opacity-80"
                  />
                ))}
              </Pie>
              {/* <Pie
                data={popularProducts}
                dataKey="amount"
                nameKey="product"
                cx="50%"
                cy="50%"
                outerRadius={86}
                innerRadius={64}
                strokeWidth={8}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180
                  const radius = 12 + innerRadius + (outerRadius - innerRadius)
                  const x = cx + radius * Math.cos(-Number(midAngle) * RADIAN)
                  const y = cy + radius * Math.sin(-Number(midAngle) * RADIAN)

                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-muted-foreground text-xs"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline={"central"}
                    >
                      {popularProducts[index as number].product.length > 12
                        ? popularProducts[index as number].product
                            .substring(0, 12)
                            .concat("...")
                        : popularProducts[index as number].product}
                      ({value})
                    </text>
                  )
                }}
              >
                {popularProducts.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`var(--chart-${i + 1})`}
                    className="stroke-background hover:opacity-80"
                  />
                ))}
              </Pie> */}
            </PieChart>
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
