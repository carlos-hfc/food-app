import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

export const getManagedRestaurant: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/managed-restaurant",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["restaurants"],
        summary: "Get managed restaurant",
        response: {
          200: z
            .object({
              id: z.string().uuid(),
              name: z.string(),
              categoryId: z.string().uuid(),
              deliveryTime: z.number(),
              tax: z.number(),
              phone: z.string(),
              admin: z.object({
                name: z.string(),
                email: z.string().email(),
              }),
              hours: z
                .object({
                  id: z.string().uuid(),
                  weekday: z.number(),
                  openedAt: z.string(),
                  closedAt: z.string(),
                  open: z.boolean(),
                })
                .array(),
              image: z.string().nullable(),
            })
            .describe("OK"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Unauthorized"),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
        select: {
          id: true,
          name: true,
          categoryId: true,
          deliveryTime: true,
          tax: true,
          phone: true,
          hours: true,
          image: true,
          admin: {
            select: {
              name: true,
              email: true,
            },
          },
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
