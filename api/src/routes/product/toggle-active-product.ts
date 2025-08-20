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
        tags: ["products"],
        summary: "Toggle product active status",
        params: z.object({
          productId: z.string().uuid(),
        }),
        response: {
          204: z.null().describe("No content"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Unauthorized"),
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

      return reply.status(204).send()
    },
  )
}
