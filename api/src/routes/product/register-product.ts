import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

import { ClientError } from "@/errors/client-error"
import { prisma } from "@/lib/prisma"
import { auth } from "@/middlewares/auth"
import { verifyUserRole } from "@/middlewares/verify-user-role"

export const registerProduct: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/restaurant/:restaurantId/product",
    {
      preHandler: [verifyUserRole("ADMIN")],
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string(),
          price: z.number(),
          available: z.boolean().optional().default(true),
        }),
        params: z.object({
          restaurantId: z.string().uuid(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const adminId = await request.getCurrentUserId()
      const { restaurantId } = request.params

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
          adminId,
        },
      })

      if (!restaurant) {
        throw new ClientError("Restaurant not found")
      }

      const { available, description, name, price } = request.body

      await prisma.product.create({
        data: {
          description,
          name,
          price,
          available,
          restaurantId,
        },
      })

      return reply.status(201).send()
    },
  )
}
