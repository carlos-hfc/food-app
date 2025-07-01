import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

export const getManagedRestaurant: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/managed-restaurant",
    {
      schema: {
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            categoryId: z.string().uuid(),
            deliveryTime: z.number(),
            tax: z.number(),
            phone: z.string(),
            hours: z
              .object({
                id: z.string().uuid(),
                weekday: z.number(),
                openedAt: z.string(),
                closedAt: z.string(),
                open: z.boolean(),
              })
              .array(),
          }),
        },
      },
    },
    async request => {
      const adminId = await request.getCurrentUserId()

      if (!adminId) {
        throw new ClientError("User not found")
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          adminId,
        },
        select: {
          id: true,
          name: true,
          categoryId: true,
          deliveryTime: true,
          tax: true,
          phone: true,
          hours: true,
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      return {
        ...restaurant,
        tax: restaurant.tax.toNumber(),
        hours: restaurant.hours.map(hour => ({
          ...hour,
          openedAt: convertMinutesToHours(hour.openedAt),
          closedAt: convertMinutesToHours(hour.closedAt),
        })),
      }
    },
  )
}
