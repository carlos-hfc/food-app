import { tz, TZDate } from "@date-fns/tz"
import { differenceInMinutes, startOfToday } from "date-fns"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Hour, Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const listFavorites: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/favorite",
    {
      preHandler: [verifyUserRole("CLIENT")],
      schema: {
        response: {
          200: z.object({
            favorites: z.array(
              z.object({
                id: z.string().uuid(),
                clientId: z.string().uuid(),
                restaurantId: z.string().uuid(),
                restaurant: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  tax: z.custom<Prisma.Decimal>(),
                  deliveryTime: z.number(),
                  image: z.string().nullable(),
                  category: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  }),
                  isOpen: z.boolean(),
                }),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const clientId = await request.getCurrentUserId()

      const favorites = await prisma.favorite.findMany({
        where: {
          clientId,
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              image: true,
              deliveryTime: true,
              tax: true,
              category: true,
              hours: {
                where: {
                  weekday: {
                    equals: new TZDate().getDay(),
                  },
                },
                take: 1,
              },
            },
          },
        },
      })

      const isOpen = (hour: Hour) =>
        differenceInMinutes(new TZDate(), startOfToday({ in: tz("-03:00") })) >
          hour.openedAt &&
        differenceInMinutes(new TZDate(), startOfToday({ in: tz("-03:00") })) <
          hour.closedAt

      return {
        favorites: favorites.map(item => ({
          id: item.id,
          clientId: item.clientId,
          restaurantId: item.restaurantId,
          restaurant: {
            id: item.restaurant.id,
            name: item.restaurant.name,
            image: item.restaurant.image,
            deliveryTime: item.restaurant.deliveryTime,
            tax: item.restaurant.tax,
            category: item.restaurant.category,
            isOpen: isOpen(item.restaurant.hours[0]),
          },
        })),
      }
    },
  )
}
