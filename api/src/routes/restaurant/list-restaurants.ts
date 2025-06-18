import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const listRestaurants: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant",
    {
      schema: {
        response: {
          200: z.object({
            restaurants: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                phone: z.string(),
                tax: z.custom<Prisma.Decimal>(),
                deliveryTime: z.number(),
                image: z.string().nullable(),
                adminId: z.string().uuid(),
                hours: z.array(
                  z.object({
                    id: z.string().uuid(),
                    weekday: z.number(),
                    openedAt: z.number(),
                    closedAt: z.number(),
                    open: z.boolean(),
                    restaurantId: z.string().uuid(),
                  }),
                ),
                category: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                }),
              }),
            ),
          }),
        },
      },
    },
    async () => {
      const restaurants = await prisma.restaurant.findMany({
        include: {
          hours: {
            orderBy: [{ weekday: "asc" }],
          },
          category: true,
        },
      })

      return {
        restaurants: restaurants.map(item => ({
          id: item.id,
          name: item.name,
          adminId: item.adminId,
          phone: item.phone,
          tax: item.tax,
          deliveryTime: item.deliveryTime,
          image: item.image,
          hours: item.hours,
          category: item.category,
        })),
      }
    },
  )
}
