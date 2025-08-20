import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const registerProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/products",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["products"],
        summary: "Register a product",
        body: z.object({
          name: z.string(),
          description: z.string(),
          price: z.number(),
          available: z.boolean().optional().default(true),
          active: z.boolean().optional().default(true),
        }),
        response: {
          201: z.object({ productId: z.string().uuid() }).describe("Created"),
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

      const { available, active, description, name, price } = request.body

      const { id } = await prisma.product.create({
        data: {
          description,
          name,
          price,
          restaurantId,
          available,
          active,
        },
      })

      return reply.status(201).send({ productId: id })
    },
  )
}
