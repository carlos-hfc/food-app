import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const editProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/products/:productId",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["products"],
        summary: "Update a product",
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
        }),
        params: z.object({
          productId: z.string().uuid(),
        }),
        response: {
          204: z.null().describe("OK"),
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

      const { description, name, price } = request.body

      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          description,
          name,
          price,
        },
      })

      return reply.status(204).send()
    },
  )
}
