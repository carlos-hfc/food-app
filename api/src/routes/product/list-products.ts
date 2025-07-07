import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const listProducts: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/product",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              price: z.number(),
              available: z.boolean(),
            }),
          ),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()

      const products = await prisma.product.findMany({
        where: {
          restaurantId,
        },
        select: {
          id: true,
          name: true,
          price: true,
          available: true,
        },
      })

      return products.map(item => ({
        ...item,
        price: item.price.toNumber(),
      }))
    },
  )
}
