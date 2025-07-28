import { getDay, startOfToday } from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

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
  grade: number
  comment: string | null
  ratingDate: Date
}

interface QueryRateResume {
  average: number
  totalCount: number
}

interface QueryRateByGrade {
  count: number
  grade: number
}

export const getInfoRestaurant: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant/:restaurantId/info",
    {
      schema: {
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          200: z.object({
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
                grade: z.number(),
                comment: z.string().nullable(),
                ratingDate: z.date(),
              }),
            ),
            rateResume: z.object({
              totalCount: z.number(),
              average: z.number(),
            }),
            rateByGrade: z.array(
              z.object({
                count: z.number(),
                grade: z.number(),
              }),
            ),
          }),
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
          o.id,
          o.grade,
          o.comment,
          o."ratingDate",
          u.name client
        from orders o
        join users u on u.id = o."clientId"
        where o."restaurantId" = ${restaurantId}
          and o."ratingDate" is not null
        order by o."ratingDate" desc
      `)

      const rateResume = await prisma.$queryRaw<QueryRateResume[]>(Prisma.sql`
        select
          avg(o.grade)::float average,
          count(o.grade)::int "totalCount"
        from orders o
        where o."restaurantId" = ${restaurantId}
      `)

      const rateByGrade = await prisma.$queryRaw<QueryRateByGrade[]>(Prisma.sql`
        select
          count(o.grade)::int,
          o.grade
        from orders o
        where o."restaurantId" = ${restaurantId}
          and o.grade is not null
        group by o.grade
        order by o.grade desc
      `)

      return {
        restaurant,
        rates,
        rateResume: {
          average: rateResume[0].average ?? 0,
          totalCount: rateResume[0].totalCount ?? 0,
        },
        rateByGrade,
      }
    },
  )
}
