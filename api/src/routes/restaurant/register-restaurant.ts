import { hash } from "bcryptjs"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Role } from "generated/prisma"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { PASSWORD_REGEX } from "@/utils/constants"
import { convertHoursToMinutes } from "@/utils/convert-hours-to-minutes"

export const registerRestaurant: FastifyPluginAsyncZod = async app => {
  app.post(
    "/restaurant",
    {
      schema: {
        body: z.object({
          managerName: z.string(),
          restaurantName: z.string(),
          email: z.string().email(),
          password: z.string().refine(value => PASSWORD_REGEX.test(value), {
            message:
              "Password must contain at least eight characters, an uppercase letter, a lowercase letter, a number and a special character",
          }),
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
      const {
        categoryId,
        deliveryTime,
        hours,
        phone,
        tax,
        email,
        managerName,
        password,
        restaurantName,
      } = request.body

      const operationHours = hours.flatMap(item => {
        const weekday = item.weekday.split(",")

        return weekday.map(week => ({
          weekday: Number(week),
          openedAt: convertHoursToMinutes(item.openedAt),
          closedAt: convertHoursToMinutes(item.closedAt),
          open: item.open ?? true,
        }))
      })

      if (operationHours.length < 7) {
        throw new ClientError("Invalid weekdays")
      }

      await prisma.user.create({
        data: {
          email,
          name: managerName,
          password: await hash(password, 10),
          phone,
          role: Role.ADMIN,
          restaurant: {
            create: {
              deliveryTime,
              name: restaurantName,
              phone,
              tax,
              categoryId,
              hours: {
                createMany: {
                  data: operationHours,
                },
              },
            },
          },
        },
      })

      return reply.status(201).send()
    },
  )
}
