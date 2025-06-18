import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"
import { convertHoursToMinutes } from "@/utils/convert-hours-to-minutes"

export const registerRestaurant: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/restaurant",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        body: z.object({
          name: z.string(),
          phone: z.string(),
          tax: z.number(),
          deliveryTime: z.number(),
          categoryId: z.string().uuid(),
          hours: z.array(
            z.object({
              weekday: z.string(),
              openedAt: z.string(),
              closedAt: z.string(),
              open: z.boolean().optional(),
            }),
          ),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const adminId = await request.getCurrentUserId()

      const { categoryId, deliveryTime, hours, name, phone, tax } = request.body

      const operationHours = hours.flatMap(item => {
        const weekday = item.weekday.split(",")

        if (weekday.length < 7) {
          throw new ClientError("Invalid weekdays")
        }

        return weekday.map(week => ({
          weekday: Number(week),
          openedAt: convertHoursToMinutes(item.openedAt),
          closedAt: convertHoursToMinutes(item.closedAt),
          open: item.open ?? true,
        }))
      })

      await prisma.restaurant.create({
        data: {
          deliveryTime,
          name,
          phone,
          tax,
          adminId,
          categoryId,
          hours: {
            createMany: {
              data: operationHours,
            },
          },
        },
      })

      return reply.status(201).send()
    },
  )
}
