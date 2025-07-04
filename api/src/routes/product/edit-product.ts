import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const editProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/product/:productId",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          available: z.boolean().optional(),
        }),
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

      const { available, description, name, price } = request.body

      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          description,
          name,
          price,
          available,
        },
      })

      return reply.send()
    },
  )
}
