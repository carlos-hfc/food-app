import { TZDate } from "@date-fns/tz"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

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
                  tax: z.number(),
                  deliveryTime: z.number(),
                  image: z.string().nullable(),
                  category: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  }),
                  isOpen: z.boolean(),
                  openingAt: z.string().optional(),
                }),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const { id: clientId } = await request.getCurrentUser()

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
                orderBy: {
                  weekday: "asc",
                },
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

      return {
        favorites: favorites.map(item => ({
          ...item,
          restaurant: {
            ...item.restaurant,
            tax: item.restaurant.tax.toNumber(),
            isOpen: restaurantIsOpen(item.restaurant.hours[0]),
            openingAt:
              item.restaurant.hours[0].open &&
              !restaurantIsOpen(item.restaurant.hours[0])
                ? convertMinutesToHours(item.restaurant.hours[0].openedAt)
                : undefined,
          },
        })),
      }
    },
  )
}
