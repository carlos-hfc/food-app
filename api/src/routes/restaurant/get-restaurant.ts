import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"

export const getRestaurant: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant/:restaurantId",
    {
      schema: {
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          200: z.object({
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
              hours: z.array(
                z.object({
                  id: z.string().uuid(),
                  restaurantId: z.string().uuid(),
                  open: z.boolean(),
                  weekday: z.number(),
                  openedAt: z.number(),
                  closedAt: z.number(),
                }),
              ),
            }),
          }),
        },
      },
    },
    async request => {
      const { restaurantId } = request.params

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
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
          },
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      return {
        restaurant: {
          ...restaurant,
          tax: restaurant.tax.toNumber(),
        },
      }
    },
  )
}
