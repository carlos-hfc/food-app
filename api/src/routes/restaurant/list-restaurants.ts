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
  rate: number
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
          rate: z.coerce.number().optional(),
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
              rate: z.number(),
              isOpen: z.boolean(),
              openingAt: z.string().optional(),
            }),
          ),
        },
      },
    },
    async request => {
      const { name, category, tax, deliveryTime, rate } = request.query

      const search: Prisma.Sql[] = []

      if (name) search.push(Prisma.sql`r.name ilike ${`%${name}%`}`)
      if (deliveryTime)
        search.push(Prisma.sql`r."deliveryTime" <= ${deliveryTime}`)
      if (tax) search.push(Prisma.sql`r.tax <= ${tax}::money`)
      if (category) search.push(Prisma.sql`cat.name ilike ${`%${category}%`}`)

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
          h.open,
          h."openedAt",
          h."closedAt",
          avg(e.rate) rate
        from restaurants r
        join categories cat on cat.id = r."categoryId"
        left join orders o on o."restaurantId" = r.id
        left join evaluations e on e."orderId" = o.id
        join hours h 
          on h."restaurantId" = r.id 
          and h.weekday = extract('dow' from now() at time zone 'America/Sao_Paulo')
          and h.open = true
        ${where}
        group by r.id, cat.id, h.id
        order by h.open, h."openedAt", h."closedAt"
        ${rate ? Prisma.sql`having avg(e.rate) > ${rate}` : Prisma.empty}
      `)

      return query.map(item => ({
        ...item,
        rate: Number(item.rate),
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
