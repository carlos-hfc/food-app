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
          200: z.object({
            products: z.array(
              z.object({
                id: z.string(),
                restaurantId: z.string(),
                name: z.string(),
                description: z.string(),
                price: z.number(),
                available: z.boolean(),
                image: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const adminId = await request.getCurrentUserId()

      const products = await prisma.product.findMany({
        where: {
          restaurant: {
            adminId,
          },
        },
      })

      return {
        products: products.map(item => ({
          ...item,
          price: item.price.toNumber(),
        })),
      }
    },
  )
}
