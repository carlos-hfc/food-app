import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { Prisma } from "generated/prisma"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const listProducts: FastifyPluginAsyncZod = async app => {
  app.get(
    "/restaurant/:restaurantId/product",
    {
      schema: {
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            products: z.array(
              z.object({
                id: z.string(),
                restaurantId: z.string(),
                name: z.string(),
                description: z.string(),
                price: z.custom<Prisma.Decimal>(),
                available: z.boolean(),
                image: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const { restaurantId } = request.params

      const products = await prisma.product.findMany({
        where: {
          restaurantId,
          available: true,
        },
      })

      return { products }
    },
  )
}
