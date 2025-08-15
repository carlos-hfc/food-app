import { tz } from "@date-fns/tz"
import {
  addWeeks,
  differenceInDays,
  eachDayOfInterval,
  format,
  startOfToday,
  subWeeks,
} from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

interface Query {
  datetime: string
  receipt: string
}

export const getDailyReceiptInPeriod: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/daily-receipt-in-period",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        querystring: z.object({
          from: z.string().optional(),
          to: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              date: z.string(),
              receipt: z.number(),
            }),
          ),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()

      const { from, to } = request.query

      const startDate = format(
        from ?? subWeeks(startOfToday(), 1),
        "yyyy-MM-dd",
        { in: tz("+03:00") },
      )
      const endDate = format(
        to || (from ? addWeeks(startDate, 1) : startOfToday()),
        "yyyy-MM-dd",
        { in: tz("+03:00") },
      )

      if (differenceInDays(endDate, startDate) > 7) {
        throw new ClientError("The interval of the dates cannot exceed 7 days")
      }

      const receiptPerDay = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select
          to_char(o.date, 'DD/MM') datetime,
          sum(o.total) receipt
        from orders o
        where o."restaurantId" = ${restaurantId}
          and o.date::varchar between ${startDate} and ${endDate}
          and o.status = 'DELIVERED'
        group by datetime
        order by datetime desc
        limit 7
      `)

      const interval = {
        start: startDate,
        end: endDate,
      }

      for (const value of eachDayOfInterval(interval)) {
        const exists = receiptPerDay.find(
          item => item.datetime === format(value, "dd/MM"),
        )

        if (!exists)
          receiptPerDay.push({
            datetime: format(value, "dd/MM"),
            receipt: "0",
          })
      }

      const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
        const [dayA, monthA] = a.datetime.split("/").map(Number)
        const [dayB, monthB] = b.datetime.split("/").map(Number)

        if (monthA === monthB) {
          return dayB - dayA
        } else {
          const dateA = new Date(new Date().getFullYear(), monthA - 1)
          const dateB = new Date(new Date().getFullYear(), monthB - 1)

          return dateB.getTime() - dateA.getTime()
        }
      })

      orderedReceiptPerDay.pop()

      return orderedReceiptPerDay.map(item => ({
        date: item.datetime,
        receipt: Number(item.receipt),
      }))
    },
  )
}
