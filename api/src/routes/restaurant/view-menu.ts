import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const viewMenu: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant/:restaurantId/menu",
    {
      schema: {
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              restaurantId: z.string().uuid(),
              name: z.string(),
              description: z.string(),
              price: z.number(),
              image: z.string().nullable(),
            }),
          ),
        },
      },
    },
    async request => {
      const { restaurantId } = request.params

      const products = await prisma.product.findMany({
        where: {
          restaurantId,
          available: true,
          active: true,
        },
        orderBy: {
          name: "asc",
        },
      })

      return products.map(item => ({
        ...item,
        price: item.price.toNumber(),
      }))
    },
  )
}
