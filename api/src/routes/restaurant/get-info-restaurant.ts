import { getDay, startOfToday } from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

interface QueryRestaurants {
  id: string
  name: string
  phone: string
  image: string | null
  tax: number
  deliveryTime: number
  category: string
  hourId: string
  weekday: number
  openedAt: number
  closedAt: number
  open: boolean
}

interface QueryRates {
  id: string
  client: string
  rate: number
  comment: string | null
  createdAt: Date
}

interface QueryRateResume {
  average: number
  totalCount: number
}

interface QueryEvaluationByRate {
  count: number
  rate: number
}

export const getInfoRestaurant: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurants/:restaurantId/info",
    {
      schema: {
        tags: ["restaurants"],
        summary: "Get restaurant information",
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          200: z
            .object({
              restaurant: z.object({
                id: z.string().uuid(),
                image: z.string().nullable(),
                name: z.string(),
                phone: z.string(),
                category: z.string(),
                tax: z.number(),
                deliveryTime: z.number(),
                isOpen: z.boolean(),
                openingAt: z.string().optional(),
                hours: z.array(
                  z.object({
                    hourId: z.string().uuid(),
                    weekday: z.number(),
                    openedAt: z.string(),
                    closedAt: z.string(),
                    open: z.boolean(),
                  }),
                ),
              }),
              rates: z.array(
                z.object({
                  id: z.string().uuid(),
                  client: z.string(),
                  rate: z.number(),
                  comment: z.string().nullable(),
                  createdAt: z.date(),
                }),
              ),
              rateResume: z.object({
                totalCount: z.number(),
                average: z.number(),
              }),
              evaluationByRate: z.array(
                z.object({
                  count: z.number(),
                  rate: z.number(),
                }),
              ),
            })
            .describe("OK"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
        },
      },
    },
    async request => {
      const { restaurantId } = request.params

      const query = await prisma.$queryRaw<QueryRestaurants[]>(Prisma.sql`
        select
          r.id,
          r.image,
          r.name,
          r.phone,
          r.tax::money,
          r."deliveryTime",
          cat.name category,
          h.id "hourId",
          h.weekday,
          h."openedAt",
          h."closedAt",
          h.open
        from restaurants r
        join categories cat on cat.id = r."categoryId"
        join hours h on h."restaurantId" = r.id
        where r.id = ${restaurantId}
        order by h.weekday asc
      `)

      if (query.length <= 0) {
        throw new ClientError("Restaurant not found")
      }

      const { id, category, image, name, phone, tax, deliveryTime } = query[0]

      const todayHour = query.find(
        item => item.weekday === getDay(startOfToday()),
      )!

      const restaurant = {
        id,
        category,
        name,
        phone,
        image,
        tax: Number(tax),
        deliveryTime,
        hours: query.map(item => ({
          hourId: item.hourId,
          weekday: item.weekday,
          openedAt: convertMinutesToHours(item.openedAt),
          closedAt: convertMinutesToHours(item.closedAt),
          open: item.open,
        })),
        isOpen: restaurantIsOpen(todayHour),
        openingAt:
          todayHour.open && !restaurantIsOpen(todayHour)
            ? convertMinutesToHours(todayHour.openedAt)
            : undefined,
      }

      const rates = await prisma.$queryRaw<QueryRates[]>(Prisma.sql`
        select
          e.id,
          e.rate,
          e.comment,
          e."createdAt",
          u.name client
        from evaluations e
        join users u on u.id = e."clientId"
        join orders o on o.id = e."orderId"
        join restaurants r on r.id = o."restaurantId"
        where r.id = ${restaurantId}
        order by e."createdAt" desc
      `)

      const rateResume = await prisma.$queryRaw<QueryRateResume[]>(Prisma.sql`
        select
          avg(e.rate)::float average,
          count(e.rate)::int "totalCount"
        from evaluations e
        join orders o on o.id = e."orderId"
        join restaurants r on r.id = o."restaurantId"
        where r.id = ${restaurantId}
      `)

      const evaluationByRate = await prisma.$queryRaw<
        QueryEvaluationByRate[]
      >(Prisma.sql`
        select
          count(e.rate)::int,
          e.rate
        from evaluations e
        join orders o on o.id = e."orderId"
        join restaurants r on r.id = o."restaurantId"
        where r.id = ${restaurantId}
        group by e.rate
        order by e.rate desc
      `)

      return {
        restaurant,
        rates,
        rateResume: {
          average: rateResume[0].average ?? 0,
          totalCount: rateResume[0].totalCount ?? 0,
        },
        evaluationByRate,
      }
    },
  )
}
