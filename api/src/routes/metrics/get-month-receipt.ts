import { endOfMonth, format, startOfToday, subMonths } from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  month: string
  receipt: number
}

export const getMonthReceipt: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/month-receipt",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["metrics"],
        summary: "List monthly receipt",
        response: {
          200: z
            .object({
              receipt: z.number(),
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
      const currentMonthWithYear = format(endOfCurrentMonth, "yyyy-MM")

      const monthReceipts = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select 
          sum(o.total) receipt,
          to_char(o.date, 'YYYY-MM') "month"
        from orders o
        where o."restaurantId" = ${restaurantId}
          and to_char(o.date, 'YYYY-MM') <= ${currentMonthWithYear}
          and o.status = 'DELIVERED'
        group by to_char(o.date, 'YYYY-MM')
        order by to_char(o.date, 'YYYY-MM') desc
      `)

      const lastMonthWithYear = format(
        subMonths(endOfCurrentMonth, 1),
        "yyyy-MM",
      )

      const currentMonthReceipt = monthReceipts.find(
        item => item.month === currentMonthWithYear,
      )
      const lastMonthReceipt = monthReceipts.find(
        item => item.month === lastMonthWithYear,
      )

      const diffFromLastMonth =
        lastMonthReceipt && currentMonthReceipt
          ? (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt
          : null

      return {
        receipt: Number(currentMonthReceipt?.receipt ?? 0),
        diffFromLastMonth: diffFromLastMonth
          ? Number((diffFromLastMonth - 100).toFixed(2))
          : 0,
      }
    },
  )
}
