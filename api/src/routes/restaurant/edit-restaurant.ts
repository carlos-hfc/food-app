import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { convertHoursToMinutes } from "@/utils/convert-hours-to-minutes"

export const editRestaurant: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/restaurants",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["restaurants"],
        summary: "Update a restaurant",
        body: z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          tax: z.number().optional(),
          deliveryTime: z.number().optional(),
          categoryId: z.string().uuid().optional(),
          hours: z
            .array(
              z.object({
                hourId: z.string().uuid(),
                openedAt: z.string().optional(),
                closedAt: z.string().optional(),
                open: z.boolean().optional(),
              }),
            )
            .optional(),
        }),
        response: {
          204: z.null().describe("No content"),
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
    async (request, reply) => {
      const restaurantId = await request.getManagedRestaurantId()

      const { deliveryTime, name, phone, tax, categoryId, hours } = request.body

      if (phone) {
        const [restaurantExists, userExists] = await Promise.all([
          prisma.restaurant.findFirst({
            where: {
              phone,
            },
          }),
          prisma.user.findFirst({
            where: {
              phone,
            },
          }),
        ])

        if (restaurantExists || userExists) {
          throw new ClientError("Restaurant already exists")
        }
      }

      await Promise.all([
        prisma.user.updateMany({
          where: {
            restaurant: {
              id: restaurantId,
            },
          },
          data: {
            phone,
          },
        }),
        prisma.restaurant.update({
          where: {
            id: restaurantId,
          },
          data: {
            name,
            phone,
            tax,
            deliveryTime,
            categoryId,
          },
        }),
      ])

      if (hours) {
        await Promise.all(
          hours.map(async item => {
            return await prisma.hour.update({
              where: {
                id: item.hourId,
              },
              data: {
                closedAt: item.closedAt
                  ? convertHoursToMinutes(item.closedAt)
                  : undefined,
                openedAt: item.openedAt
                  ? convertHoursToMinutes(item.openedAt)
                  : undefined,
                open: item.open,
              },
            })
          }),
        )
      }

      return reply.status(204).send()
    },
  )
}
