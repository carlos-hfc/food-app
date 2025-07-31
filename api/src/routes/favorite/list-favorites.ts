import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

interface Query {
  id: string
  restaurant: string
  tax: string
  deliveryTime: number
  image: string | null
  category: string
  weekday: number
  open: boolean
  openedAt: number
  closedAt: number
}

export const listFavorites: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/favorite",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              restaurant: z.string(),
              tax: z.number(),
              deliveryTime: z.number(),
              image: z.string().nullable(),
              category: z.string(),
              weekday: z.number(),
              open: z.boolean(),
              openedAt: z.string(),
              closedAt: z.string(),
              isOpen: z.boolean(),
              openingAt: z.string().optional(),
            }),
          ),
        },
      },
    },
    async request => {
      const { id: clientId } = await request.getCurrentUser()

      const query = await prisma.$queryRaw<Query[]>(Prisma.sql`
        select
          f.id,
          r.name restaurant,
          r.tax::money,
          r."deliveryTime",
          r.image,
          cat.name category,
          h.weekday,
          h.open,
          h."openedAt",
          h."closedAt"
        from favorites f
        left join restaurants r on r.id = f."restaurantId"
        join categories cat on cat.id = r."categoryId"
        join hours h on h."restaurantId" = r.id
          and h.weekday = extract('dow' from now() at time zone 'America/Sao_Paulo')
        where f."clientId" = ${clientId}
        order by f."createdAt"
      `)

      return query.map(item => ({
        ...item,
        tax: Number(item.tax),
        openedAt: convertMinutesToHours(item.openedAt),
        closedAt: convertMinutesToHours(item.closedAt),
        isOpen: restaurantIsOpen(item),
        openingAt:
          item.open && !restaurantIsOpen(item)
            ? convertMinutesToHours(item.openedAt)
            : undefined,
      }))
    },
  )
}
