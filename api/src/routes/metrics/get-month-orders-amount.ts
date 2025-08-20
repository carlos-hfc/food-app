import { endOfMonth, format, startOfToday, subMonths } from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  amount: number
  month: string
}

export const getMonthOrdersAmount: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/month-orders-amount",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["metrics"],
        summary: "List the monthly amount of orders",
        response: {
          200: z
            .object({
              amount: z.number(),
              diffFromLastMonth: z.number(),
            })
            .describe("OK"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Unauthorized"),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()

      const today = startOfToday()
      const endOfCurrentMonth = endOfMonth(today)

      const orderPerMonth = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select 
          count(o.id)::int amount,
          to_char(o.date, 'YYYY-MM') "month"
        from orders o
        where o."restaurantId" = ${restaurantId}
          and o.date <= ${endOfCurrentMonth}
          and o.status = 'DELIVERED'
        group by "month"
        having count(o.id) > 1
        order by "month" desc
        limit 2  
      `)

      const currentMonthWithYear = format(endOfCurrentMonth, "yyyy-MM")
      const lastMonthWithYear = format(
        subMonths(endOfCurrentMonth, 1),
        "yyyy-MM",
      )

      const currentMonthOrdersAmount = orderPerMonth.find(
        item => item.month === currentMonthWithYear,
      )
      const lastMonthOrdersAmount = orderPerMonth.find(
        item => item.month === lastMonthWithYear,
      )

      const diffFromLastMonth =
        lastMonthOrdersAmount && currentMonthOrdersAmount
          ? (currentMonthOrdersAmount.amount * 100) /
            lastMonthOrdersAmount.amount
          : null

      return {
        amount: currentMonthOrdersAmount?.amount ?? 0,
        diffFromLastMonth: diffFromLastMonth
          ? Number((diffFromLastMonth - 100).toFixed(2))
          : 0,
      }
    },
  )
}
