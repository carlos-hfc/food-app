import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const toggleActiveProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/products/:productId/active",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        params: z.object({
          productId: z.string().uuid(),
        }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
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

      await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          active: !product.active,
        },
      })

      return reply.send()
    },
  )
}
