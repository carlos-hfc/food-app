import { TZDate } from "@date-fns/tz"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

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
            id: z.string().uuid(),
            name: z.string(),
            tax: z.number(),
            deliveryTime: z.number(),
            image: z.string().nullable(),
            grade: z.object({
              avg: z.string().nullable(),
              count: z.number(),
            }),
            isOpen: z.boolean(),
            openingAt: z.string().optional(),
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
          hours: {
            orderBy: {
              weekday: "asc",
            },
            where: {
              weekday: new TZDate().getDay(),
            },
            take: 1,
          },
        },
      })

      const grade = await prisma.order.aggregate({
        where: {
          restaurantId,
        },
        _avg: {
          grade: true,
        },
        _count: {
          grade: true,
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      return {
        ...restaurant,
        tax: restaurant.tax.toNumber(),
        isOpen: restaurantIsOpen(restaurant.hours[0]),
        openingAt:
          restaurant.hours[0].open && !restaurantIsOpen(restaurant.hours[0])
            ? convertMinutesToHours(restaurant.hours[0].openedAt)
            : undefined,
        grade: {
          avg: grade._avg.grade?.toFixed(2) ?? null,
          count: grade._count.grade,
        },
      }
    },
  )
}
