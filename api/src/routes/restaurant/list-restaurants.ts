import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

interface Query {
  id: string
  name: string
  image: string | null
  tax: string
  deliveryTime: number
  category: string
  openedAt: number
  closedAt: number
  open: boolean
  weekday: number
  avg: string
}

export const listRestaurants: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant",
    {
      schema: {
        querystring: z.object({
          name: z.string().optional(),
          category: z.string().optional(),
          tax: z.coerce.number().optional(),
          deliveryTime: z.coerce.number().optional(),
          pageIndex: z.coerce.number().default(0),
          grade: z.coerce.number().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              tax: z.number(),
              deliveryTime: z.number(),
              image: z.string().nullable(),
              category: z.string(),
              isOpen: z.boolean(),
              openingAt: z.string().optional(),
            }),
          ),
        },
      },
    },
    async request => {
      const { name, category, tax, deliveryTime, grade } = request.query

      const search: Prisma.Sql[] = []

      if (name) {
        search.push(Prisma.sql`r.name ilike ${`%${name}%`}`)
      }
      if (deliveryTime) {
        search.push(Prisma.sql`r."deliveryTime" <= ${deliveryTime}`)
      }
      if (tax) {
        search.push(Prisma.sql`r.tax <= ${tax}::money`)
      }
      if (category) {
        search.push(Prisma.sql`cat.name ilike ${category}`)
      }

      const where = search.length
        ? Prisma.sql`where ${Prisma.join(search, " and ")}`
        : Prisma.empty

      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select
          r.id,
          r.name,
          r.image,
          r.tax,
          r."deliveryTime",
          cat.name category,
          h.*,
          avg(o.grade)
        from restaurants r
        join categories cat on cat.id = r."categoryId"
        join orders o on o."restaurantId" = r.id
        join hours h 
          on h."restaurantId" = r.id 
          and h.weekday = extract('dow' from now() at time zone 'America/Sao_Paulo')
          and h.open = true
        ${where}
        group by r.id, cat.id, h.id
        ${grade ? Prisma.sql`having avg(o.grade) > ${grade}` : Prisma.empty}
      `)

      return query.map(item => ({
        ...item,
        tax: Number(item.tax),
        isOpen: restaurantIsOpen(item),
        openingAt:
          item.open && !restaurantIsOpen(item)
            ? convertMinutesToHours(item.openedAt)
            : undefined,
      }))
    },
  )
}
