import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"

export const getInfoRestaurant: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant/:restaurantId/info",
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
              phone: z.string(),
              category: z.object({
                name: z.string(),
              }),
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
            }),
            rates: z.array(
              z.object({
                grade: z.number().nullable(),
                comment: z.string().nullable(),
                ratingDate: z.date().nullable(),
                client: z.object({
                  name: z.string(),
                }),
              }),
            ),
            avgGrade: z.string().nullable(),
            totalGrade: z.number(),
            rateResume: z.array(
              z.object({
                _count: z.number(),
                grade: z.number().nullable(),
              }),
            ),
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
          phone: true,
          category: {
            select: {
              name: true,
            },
          },
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

      const rateResume = await prisma.order.groupBy({
        by: ["grade"],
        orderBy: {
          grade: "desc",
        },
        _count: true,
      })

      const rates = await prisma.order.findMany({
        where: {
          restaurantId,
        },
        select: {
          grade: true,
          comment: true,
          ratingDate: true,
          client: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          ratingDate: "desc",
        },
      })

      return {
        restaurant,
        rates,
        avgGrade: grade._avg.grade?.toFixed(2) ?? null,
        totalGrade: grade._count.grade,
        rateResume,
      }
    },
  )
}
