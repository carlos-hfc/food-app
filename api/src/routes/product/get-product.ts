import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const getProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/product/:productId",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        params: z.object({
          productId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            image: z.string().nullable(),
          }),
        },
      },
    },
    async request => {
      const restaurantId = await request.getManagedRestaurantId()
      const { productId } = request.params

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
          restaurantId,
        },
      })

      if (!product) {
        throw new ClientError("Product not found")
      }

      return {
        ...product,
        price: product.price.toNumber(),
      }
    },
  )
}
