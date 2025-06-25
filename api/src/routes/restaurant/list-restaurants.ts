import { TZDate } from "@date-fns/tz"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { restaurantIsOpen } from "@/utils/check-restaurant-is-open"
import { PER_PAGE } from "@/utils/constants"
import { convertMinutesToHours } from "@/utils/convert-minutes-to-hours"

export const listRestaurants: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant",
    {
      schema: {
        querystring: z.object({
          category: z.string().optional(),
          tax: z.coerce.number().optional(),
          deliveryTime: z.coerce.number().optional(),
          pageIndex: z.coerce.number().default(0),
        }),
        response: {
          200: z.object({
            restaurants: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                phone: z.string(),
                tax: z.number(),
                deliveryTime: z.number(),
                image: z.string().nullable(),
                adminId: z.string().uuid(),
                category: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                }),
                isOpen: z.boolean(),
                openingAt: z.string().optional(),
              }),
            ),
            meta: z.object({
              totalCount: z.number(),
              pageIndex: z.number(),
              perPage: z.number(),
            }),
          }),
        },
      },
    },
    async request => {
      const { category, tax, deliveryTime, pageIndex } = request.query

      const restaurants = await prisma.restaurant.findMany({
        include: {
          hours: {
            orderBy: [{ weekday: "asc" }],
            where: {
              weekday: new TZDate().getDay(),
              open: true,
            },
          },
          category: true,
        },
        where: {
          category: {
            name: {
              mode: "insensitive",
              equals: category,
            },
          },
          tax: {
            lte: tax,
          },
          deliveryTime: {
            lte: deliveryTime,
          },
        },
        take: PER_PAGE,
        skip: pageIndex * PER_PAGE,
      })

      const totalCount = await prisma.restaurant.count({
        where: {
          category: {
            name: {
              mode: "insensitive",
              equals: category,
            },
          },
          tax: {
            lte: tax,
          },
          deliveryTime: {
            lte: deliveryTime,
          },
        },
      })

      return {
        restaurants: restaurants.map(item => ({
          ...item,
          tax: item.tax.toNumber(),
          isOpen: restaurantIsOpen(item.hours[0]),
          openingAt:
            item.hours[0].open && !restaurantIsOpen(item.hours[0])
              ? convertMinutesToHours(item.hours[0].openedAt)
              : undefined,
        })),
        meta: {
          totalCount,
          pageIndex,
          perPage: PER_PAGE,
        },
      }
    },
  )
}
